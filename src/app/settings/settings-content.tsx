"use client";

import { api } from "@/lib/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useAction, useMutation, useQuery } from "convex/react";
import {
  AlertTriangle,
  ChevronRight,
  Crown,
  EyeOff,
  Loader2,
  Palette,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "../components/theme-toggle";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Switch } from "../components/ui/switch";

import { SITE_NAME } from "@/lib/constants/site-info";
import { toastManager } from "@/lib/toast";
import * as Sentry from "@sentry/nextjs";

function SettingsContent() {
  const user = useQuery(api.user.currentUser);
  const paymentStatus = useQuery(api.stripe.getPaymentStatus);
  const updatePrivacy = useMutation(api.user.updateListeningHistoryPrivacy);
  const deleteAccount = useMutation(api.user.deleteAccount);
  const generateStripeCheckout = useAction(api.stripe.generateStripeCheckout);
  const { signOut } = useAuthActions();
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handlePrivacyToggle = async (checked: boolean) => {
    await updatePrivacy({ isPrivate: checked });
  };

  const handleUpgrade = async () => {
    setIsUpgrading(true);

    try {
      const { url } = await generateStripeCheckout();

      if (!url) throw new Error("checkout url is null");

      window.location.assign(url);
    } catch (err) {
      Sentry.captureException(err);

      setIsUpgrading(false);

      toastManager.add({
        title: "Error",
        description: "Failed to start checkout. Please try again.",
      });
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    try {
      await deleteAccount();
      await signOut();

      router.push("/");
    } catch (err) {
      Sentry.captureException(err);

      setIsDeleting(false);

      toastManager.add({
        title: "Error",
        description: "Failed to delete account. Please contact support.",
      });
    }
  };

  if (!user || paymentStatus === undefined) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {paymentStatus.hasPaid ? (
        <div className="group rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-rose-500/5 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/25">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Plus</span>
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                  Active
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                Thank you for supporting {SITE_NAME}!
              </p>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={handleUpgrade}
          disabled={isUpgrading}
          className="group w-full cursor-pointer rounded-xl border border-transparent bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-pink-500/10 p-5 text-left transition-all hover:border-violet-500/20 hover:from-violet-500/15 hover:via-fuchsia-500/15 hover:to-pink-500/15"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/25 transition-transform group-hover:scale-105">
              {isUpgrading ? (
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              ) : (
                <Crown className="h-6 w-6 text-white" />
              )}
            </div>
            <div className="flex-1">
              <div className="font-semibold">Upgrade to Plus</div>
              <p className="text-muted-foreground text-sm">
                Get premium features and support the platform
              </p>
            </div>
            <ChevronRight className="text-muted-foreground h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </button>
      )}

      {/* Settings List */}
      <div className="divide-border divide-y overflow-hidden rounded-xl border">
        {/* Privacy Toggle */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="text-muted-foreground">
              <EyeOff className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-medium">
                Private listening history
              </div>
              <p className="text-muted-foreground text-xs">
                Hide your listening activity from others
              </p>
            </div>
          </div>
          <Switch
            checked={user.listeningHistoryPrivate ?? false}
            onCheckedChange={handlePrivacyToggle}
          />
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="text-muted-foreground">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-medium">Theme</div>
              <p className="text-muted-foreground text-xs">
                Switch between light and dark themes
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="pt-6">
        <h3 className="text-muted-foreground mb-3 text-xs font-medium tracking-wider uppercase">
          Danger Zone
        </h3>
        <div className="overflow-hidden rounded-xl border border-red-500/20">
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger className="flex w-full cursor-pointer items-center justify-between p-4 text-left transition-colors hover:bg-red-500/5">
              <div className="flex items-center gap-3">
                <div className="text-red-500">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-red-600 dark:text-red-400">
                    Delete account
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Permanently delete your account and all data
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-red-400" />
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <DialogTitle>Delete your account?</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                This action cannot be undone. This will permanently delete your
                account and remove all of your data from our servers, including
                your polls, votes, followers, and listening history.
              </DialogDescription>
              <div className="mt-6 flex gap-3">
                <DialogClose className="bg-secondary text-secondary-foreground hover:bg-secondary/80 flex-1 cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium transition-colors">
                  Cancel
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="flex-1 cursor-pointer"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Delete account"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default SettingsContent;
