import { AdminLayout } from "@/components/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Phone, MapPin, Calendar, Edit } from "lucide-react";
import { api } from "@/lib/api";

const Profile = () => {
  let { data: profileData } = api.profile.getAll();
  const profile = profileData?.user || {};

  const firstName = profile?.name?.split(" ")[0] || "";
  const lastName = profile?.name?.split(" ")[1] || "";

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Admin Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid gap-6">
          {/* Profile Header Card */}
          <Card className="shadow-elegant">
            <CardHeader>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 border-4 border-primary/20">
                  <AvatarImage
                    src="/placeholder.svg"
                    alt={profile?.name || ""}
                  />
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl font-bold">
                    {profile?.name
                      ? profile.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                      : ""}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-1">
                    {profile?.name || ""}
                  </CardTitle>
                  <CardDescription>Salon Administrator</CardDescription>
                  <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                    {profile?.createdAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Joined{" "}
                          {new Date(profile.createdAt).toLocaleString("en-US", {
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <Button variant="outline" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Your contact details and communication preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      defaultValue={profile?.phone_number || ""}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-gradient-primary">Save Changes</Button>
              </div> */}
            </CardContent>
          </Card>

          {/* Account Settings */}
          {/* <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account security and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    defaultValue={firstName}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    defaultValue={lastName}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="admin"
                  defaultValue={profile?.user || "admin"}
                />
              </div>

              <Separator />

              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-gradient-primary">Update Settings</Button>
              </div>
            </CardContent>
          </Card> */}

          {/* Security */}
          {/* <Card className="shadow-elegant border-primary/20">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button className="bg-gradient-primary">Change Password</Button>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Profile;
