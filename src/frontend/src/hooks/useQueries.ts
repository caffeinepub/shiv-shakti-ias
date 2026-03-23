import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Course,
  NewCourse,
  NewRecording,
  Recording,
  TestScore,
  UserProfile,
} from "../backend.d";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useListCourses() {
  const { actor, isFetching } = useActor();
  return useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCourses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCourse(courseId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Course | null>({
    queryKey: ["course", courseId?.toString()],
    queryFn: async () => {
      if (!actor || courseId === null) return null;
      return actor.getCourseById(courseId);
    },
    enabled: !!actor && !isFetching && courseId !== null,
  });
}

export function useGetCallerProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["currentUserProfile"] }),
  });
}

export function useGetUserTestScores() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<TestScore[]>({
    queryKey: ["testScores"],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getUserTestScores(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useSubmitTestScore() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      subject: string;
      marks: bigint;
      totalMarks: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitTestScore(data.subject, data.marks, data.totalMarks);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["testScores"] }),
  });
}

export function useGetEnrollments() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: ["enrollments"],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getStudentEnrollmentsList(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useEnrollCourse() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (courseId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.enrollStudentInCourse(courseId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["enrollments"] }),
  });
}

export function useGetCourseDoubts(courseId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["doubts", courseId?.toString()],
    queryFn: async () => {
      if (!actor || courseId === null) return [];
      return actor.getCourseDoubtsList(courseId);
    },
    enabled: !!actor && !isFetching && courseId !== null,
  });
}

export function usePostDoubt() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { courseId: bigint; questionText: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.postDoubt(data.courseId, data.questionText);
    },
    onSuccess: (_: unknown, vars: { courseId: bigint; questionText: string }) =>
      qc.invalidateQueries({ queryKey: ["doubts", vars.courseId.toString()] }),
  });
}

export function useCreateCourse() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (course: NewCourse) => {
      if (!actor) throw new Error("Not connected");
      return actor.createCourse(course);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["courses"] }),
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useListRecordings() {
  const { actor, isFetching } = useActor();
  return useQuery<Recording[]>({
    queryKey: ["recordings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listRecordings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddRecording() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (recording: NewRecording) => {
      if (!actor) throw new Error("Not connected");
      return actor.addRecording(recording);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recordings"] }),
  });
}
