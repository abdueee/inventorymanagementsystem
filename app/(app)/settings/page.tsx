import { auth } from "@/lib/auth";
import {
  deleteManagedUser,
  setManagedUserRole,
} from "@/lib/actions/admin-actions";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SettingsPageProps = {
  searchParams?: Promise<{
    error?: string;
    status?: string;
  }>;
};

const statusMessages: Record<string, string> = {
  "role-updated": "User role updated.",
  "user-deleted": "User deleted.",
};

const errorMessages: Record<string, string> = {
  "cannot-delete-self": "You cannot delete your own account.",
  "cannot-demote-self": "You cannot remove your own admin access.",
  "delete-user-failed": "Could not delete that user.",
  "invalid-role": "That role is not allowed.",
  "missing-fields": "Please fill in all required fields.",
  "role-update-failed": "Could not update that role.",
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  const params = (await searchParams) ?? {};
  const { users, total } = await auth.api.listUsers({
    query: {
      limit: 100,
      sortBy: "name",
      sortDirection: "asc",
    },
    headers: await headers(),
  });

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">User Management</h1>
        <p className="text-sm text-muted-foreground">
          Manage roles and account access for the inventory workspace.
        </p>
      </div>

      {params.status && statusMessages[params.status] && (
        <p className="text-sm text-emerald-600">{statusMessages[params.status]}</p>
      )}

      {params.error && errorMessages[params.error] && (
        <p className="text-sm text-destructive">{errorMessages[params.error]}</p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Team</CardTitle>
          <CardDescription>{total} users in this workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const isCurrentUser = user.id === session.user.id;
                const nextRole = user.role === "admin" ? "user" : "admin";

                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="space-y-1">
                        <p>{user.name}</p>
                        {isCurrentUser && (
                          <p className="text-xs text-muted-foreground">Current account</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap justify-end gap-2">
                        <form action={setManagedUserRole}>
                          <input type="hidden" name="userId" value={user.id} />
                          <input type="hidden" name="role" value={nextRole} />
                          <Button
                            type="submit"
                            variant="outline"
                            size="sm"
                            disabled={isCurrentUser}
                          >
                            Make {nextRole === "admin" ? "Admin" : "User"}
                          </Button>
                        </form>

                        <form action={deleteManagedUser}>
                          <input type="hidden" name="userId" value={user.id} />
                          <Button
                            type="submit"
                            variant="destructive"
                            size="sm"
                            disabled={isCurrentUser}
                          >
                            Delete
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
