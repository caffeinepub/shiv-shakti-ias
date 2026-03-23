import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { SAMPLE_COURSES } from "@/data/sampleData";
import { CheckCircle, CreditCard, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export default function Payment() {
  const [payMethod, setPayMethod] = useState("card");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [success, setSuccess] = useState(false);

  const course = SAMPLE_COURSES[0]; // Demo course

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Payment gateway integration coming soon!");
    setSuccess(true);
  };

  if (success) {
    return (
      <div
        className="container mx-auto px-4 py-20 max-w-md text-center"
        data-ocid="payment.success_state"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-navy mb-2">
            Enrollment Successful!
          </h2>
          <p className="text-muted-foreground mb-6">
            You have successfully enrolled in <strong>{course.title}</strong>.
            Check your dashboard to start learning.
          </p>
          <Button
            className="bg-primary hover:bg-primary/90 text-white rounded-full px-8"
            onClick={() => setSuccess(false)}
            data-ocid="payment.primary_button"
          >
            Go to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10" data-ocid="payment.page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-navy mb-8">
          Complete Your Enrollment
        </h1>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePay} className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-navy text-base">
                    Student Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Full Name</Label>
                    <Input
                      placeholder="Arjun Mehta"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      data-ocid="payment.input"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="arjun@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        data-ocid="payment.input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Phone</Label>
                      <Input
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        data-ocid="payment.input"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-navy text-base">
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={payMethod}
                    onValueChange={setPayMethod}
                    className="space-y-3"
                  >
                    {[
                      { value: "card", label: "Credit / Debit Card" },
                      { value: "upi", label: "UPI" },
                      { value: "netbanking", label: "Net Banking" },
                    ].map((opt) => (
                      <Label
                        key={opt.value}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:bg-accent transition-colors"
                        data-ocid="payment.radio"
                      >
                        <RadioGroupItem value={opt.value} />
                        {opt.label}
                      </Label>
                    ))}
                  </RadioGroup>

                  {payMethod === "card" && (
                    <div className="mt-5 space-y-4">
                      <div className="space-y-1.5">
                        <Label>Card Number</Label>
                        <Input
                          placeholder="1234 5678 9012 3456"
                          value={cardNum}
                          onChange={(e) => setCardNum(e.target.value)}
                          data-ocid="payment.input"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label>Expiry Date</Label>
                          <Input
                            placeholder="MM / YY"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            data-ocid="payment.input"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label>CVV</Label>
                          <Input
                            placeholder="•••"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            data-ocid="payment.input"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {payMethod === "upi" && (
                    <div className="mt-5 space-y-1.5">
                      <Label>UPI ID</Label>
                      <Input
                        placeholder="yourname@upi"
                        data-ocid="payment.input"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-full py-3 font-semibold text-base"
                data-ocid="payment.submit_button"
              >
                <CreditCard className="w-4 h-4 mr-2" /> Pay ₹
                {Number(course.price).toLocaleString()}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-20 shadow-card">
              <CardHeader>
                <CardTitle className="text-navy text-base">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.image && (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-navy text-sm">
                    {course.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {course.educatorName}
                  </p>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Course Fee</span>
                    <span>₹{Number(course.price).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹0</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-navy">
                  <span>Total</span>
                  <span>₹{Number(course.price).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                  <Shield className="w-4 h-4 text-green-500" /> 100% secure
                  payment
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
