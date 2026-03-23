import Iter "mo:core/Iter";
import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type CourseId = Nat;
  type LessonId = Nat;
  type DoubtId = Nat;
  type EnrollmentId = Nat;

  module Course {
    public type Category = {
      #generalStudies;
      #csat;
      #optionalSubject : Text;
      #currentAffairs;
      #essayWriting;
      #interviewPrep;
      #other : Text;
    };
  };

  type Course = {
    id : CourseId;
    title : Text;
    description : Text;
    price : Nat;
    durationWeeks : Nat;
    educatorName : Text;
    category : Course.Category;
    lessons : [Lesson];
  };

  type Lesson = {
    id : LessonId;
    title : Text;
    content : Text;
    courseId : CourseId;
    order : Nat;
  };

  type Enrollment = {
    id : EnrollmentId;
    student : Principal;
    courseId : CourseId;
    enrollmentDate : Time.Time;
    completedLessonIds : [LessonId];
  };

  module Doubt {
    public type Answer = {
      answeredBy : Text;
      answerText : Text;
      answeredAt : Time.Time;
    };
  };

  type Doubt = {
    id : DoubtId;
    course : CourseId;
    questionText : Text;
    student : Principal;
    postedAt : Time.Time;
    answer : ?Doubt.Answer;
  };

  type TestScore = {
    subject : Text;
    marks : Nat;
    totalMarks : Nat;
    takenAt : Time.Time;
  };

  type NewCourse = {
    title : Text;
    description : Text;
    price : Nat;
    durationWeeks : Nat;
    educatorName : Text;
    category : Text;
    lessons : [NewLesson];
  };

  type NewLesson = {
    title : Text;
    content : Text;
    order : Nat;
  };

  type CourseProgress = {
    course : CourseId;
    completedLessons : [LessonId];
    completionPercentage : Nat;
  };

  var nextCourseId = 1;
  var nextLessonId = 1;
  var nextDoubtId = 1;
  var nextEnrollmentId = 1;

  let courses = Map.empty<CourseId, Course>();
  let enrollments = Map.empty<Principal, List.List<Enrollment>>();
  let doubts = Map.empty<DoubtId, Doubt>();
  let testScores = Map.empty<Principal, List.List<TestScore>>();

  // Reusable functions

  func getCourseInternal(courseId : CourseId) : Course {
    switch (courses.get(courseId)) {
      case (null) { Runtime.trap("Course not found") };
      case (?course) { course };
    };
  };

  func convertCategory(categoryText : Text) : Course.Category {
    let normalized = categoryText.toLower();
    switch (normalized) {
      case ("general studies") { #generalStudies };
      case ("csat") { #csat };
      case ("current affairs") { #currentAffairs };
      case ("essay writing") { #essayWriting };
      case ("interview prep") { #interviewPrep };
      case ("optional") { #optionalSubject(categoryText) };
      case (_) { #other(categoryText) };
    };
  };

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    email : Text;
    role : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  func serveCourse(course : Course, caller : Principal) : Course {
    func serveLesson(lesson : Lesson, caller : Principal) : Lesson {
      lesson;
    };
    {
      course with
      lessons = course.lessons.map(func(lesson) { serveLesson(lesson, caller) });
    };
  };

  func serveCourses(courses : [Course], caller : Principal) : [Course] {
    courses.map(
      func(course) {
        serveCourse(course, caller);
      }
    );
  };

  func serveCourseWithInternalAuthentication(course : Course, caller : Principal) : Course {
    func serveLesson(lesson : Lesson, caller : Principal) : Lesson {
      lesson;
    };
    {
      course with
      lessons = course.lessons.map(func(lesson) { serveLesson(lesson, caller) });
    };
  };

  // Courses

  public shared ({ caller }) func createCourse(newCourse : NewCourse) : async Course {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can create courses");
    };
    let category = convertCategory(newCourse.category);

    func createLesson(newLesson : NewLesson, courseId : Nat, lessonId : Nat) : Lesson {
      {
        newLesson with
        id = lessonId;
        courseId;
      };
    };

    let course = {
      id = nextCourseId;
      title = newCourse.title;
      description = newCourse.description;
      price = newCourse.price;
      durationWeeks = newCourse.durationWeeks;
      educatorName = newCourse.educatorName;
      category;
      lessons = newCourse.lessons.map(
        func(newLesson) {
          let lesson = createLesson(newLesson, nextCourseId, nextLessonId);
          nextLessonId += 1;
          lesson;
        }
      );
    };
    courses.add(nextCourseId, course);
    nextCourseId += 1;
    course;
  };

  public query ({ caller }) func listCourses() : async [Course] {
    let courseArray = courses.values().toArray();
    serveCourses(courseArray, caller);
  };

  public query ({ caller }) func getCourseById(courseId : CourseId) : async Course {
    let course = getCourseInternal(courseId);
    serveCourse(course, caller);
  };

  // Enrollments

  public shared ({ caller }) func enrollStudentInCourse(courseId : CourseId) : async Enrollment {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can enroll in courses");
    };
    switch (courses.get(courseId)) {
      case (null) { Runtime.trap("Course not found") };
      case (?_course) {
        let enrollment : Enrollment = {
          id = nextEnrollmentId;
          student = caller;
          courseId;
          enrollmentDate = Time.now();
          completedLessonIds = [];
        };
        let existingEnrollments = switch (enrollments.get(caller)) {
          case (null) { List.empty<Enrollment>() };
          case (?enrollments) { enrollments };
        };
        existingEnrollments.add(enrollment);
        enrollments.add(caller, existingEnrollments);
        nextEnrollmentId += 1;
        enrollment;
      };
    };
  };

  public query ({ caller }) func getStudentEnrollmentsList(principal : Principal) : async [Enrollment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view enrollments");
    };
    func serveEnrollment(enrollment : Enrollment, caller : Principal) : Enrollment {
      let isAuthorized = caller == enrollment.student or AccessControl.hasPermission(accessControlState, caller, #admin);
      if (not isAuthorized) { Runtime.trap("Unauthorized: Can only view your own enrollments") };
      enrollment;
    };
    switch (enrollments.get(principal)) {
      case (null) { Runtime.trap("You are not enrolled in any courses") };
      case (?enrollments) {
        enrollments.toArray().map(func(enrollment) { serveEnrollment(enrollment, caller) });
      };
    };
  };

  // Lesson Progression

  public shared ({ caller }) func markLessonComplete(courseId : CourseId, lessonId : LessonId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark lessons complete");
    };
    switch (courses.get(courseId)) {
      case (null) { Runtime.trap("Course not found") };
      case (?_course) {
        let enrollmentList = switch (enrollments.get(caller)) {
          case (null) { Runtime.trap("Enrollment not found") };
          case (?enrollmentList) { enrollmentList };
        };
        let updatedEnrollmentList = enrollmentList.map<Enrollment, Enrollment>(
          func(enrollment) {
            if (enrollment.courseId == courseId) {
              let newCompletedLessons = enrollment.completedLessonIds.concat([lessonId]);
              {
                enrollment with
                completedLessonIds = newCompletedLessons;
              };
            } else {
              enrollment;
            };
          }
        );
        enrollments.add(caller, updatedEnrollmentList);
      };
    };
  };

  // Test Scores

  public shared ({ caller }) func submitTestScore(subject : Text, marks : Nat, totalMarks : Nat) : async TestScore {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit test scores");
    };
    let score : TestScore = {
      subject;
      marks;
      totalMarks;
      takenAt = Time.now();
    };
    let existingScores = switch (testScores.get(caller)) {
      case (null) { List.empty<TestScore>() };
      case (?scores) { scores };
    };
    existingScores.add(score);
    testScores.add(caller, existingScores);
    score;
  };

  public query ({ caller }) func getUserTestScores(principal : Principal) : async [TestScore] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view test scores");
    };
    func serveTestScore(testScore : TestScore, caller : Principal) : TestScore {
      let isAuthorized = caller == principal or AccessControl.hasPermission(accessControlState, caller, #admin);
      if (not isAuthorized) { Runtime.trap("Unauthorized: Can only view your own test scores") };
      testScore;
    };

    switch (testScores.get(principal)) {
      case (null) { Runtime.trap("You have no test scores submitted") };
      case (?scores) {
        scores.toArray().map(func(testScore) { serveTestScore(testScore, caller) });
      };
    };
  };

  // Doubts

  public shared ({ caller }) func postDoubt(courseId : CourseId, questionText : Text) : async Doubt {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can post doubts");
    };
    let doubt : Doubt = {
      id = nextDoubtId;
      course = courseId;
      questionText;
      student = caller;
      postedAt = Time.now();
      answer = null;
    };

    doubts.add(nextDoubtId, doubt);
    nextDoubtId += 1;
    doubt;
  };

  public query ({ caller }) func getCourseDoubtsList(courseId : CourseId) : async [Doubt] {
    doubts.values().toArray().filter(func(doubt) { doubt.course == courseId });
  };

  public shared ({ caller }) func postDoubtAnswer(doubtId : DoubtId, answerText : Text, answeredBy : Text) : async Doubt {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can answer doubts");
    };
    switch (doubts.get(doubtId)) {
      case (null) { Runtime.trap("Doubt not found") };
      case (?doubt) {
        let answer : Doubt.Answer = {
          answeredBy;
          answerText;
          answeredAt = Time.now();
        };
        let updatedDoubt = {
          doubt with
          answer = ?answer;
        };
        doubts.add(doubtId, updatedDoubt);
        updatedDoubt;
      };
    };
  };
};
