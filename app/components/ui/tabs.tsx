import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import cx from "classix";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cx(
      "inline-flex items-center justify-center rounded-lg bg-ctp-surface0 p-1",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cx(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-ctp-base data-[state=active]:text-ctp-text data-[state=active]:shadow-sm",
      "data-[state=inactive]:text-ctp-subtext0 data-[state=inactive]:hover:bg-ctp-surface1",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cx(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

// Additional utility components for more complex tab scenarios
const TabsWithUnderline = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
    fullWidth?: boolean;
  }
>(({ className, fullWidth, ...props }, ref) => (
  <Tabs
    ref={ref}
    className={cx("w-full", fullWidth && "flex flex-col", className)}
    {...props}
  />
));
TabsWithUnderline.displayName = "TabsWithUnderline";

const TabsListUnderline = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    fullWidth?: boolean;
  }
>(({ className, fullWidth, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cx(
      "inline-flex border-b border-ctp-surface0",
      fullWidth && "w-full",
      className,
    )}
    {...props}
  />
));
TabsListUnderline.displayName = "TabsListUnderline";

const TabsTriggerUnderline = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    fullWidth?: boolean;
  }
>(({ className, fullWidth, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cx(
      "inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
      "border-b-2 border-transparent data-[state=active]:border-ctp-blue",
      "data-[state=active]:text-ctp-text data-[state=inactive]:text-ctp-subtext0",
      "hover:text-ctp-text",
      fullWidth && "flex-1",
      className,
    )}
    {...props}
  />
));
TabsTriggerUnderline.displayName = "TabsTriggerUnderline";

// Scrollable tabs for when there are many tabs
const TabsScrollable = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ className, ...props }, ref) => (
  <Tabs ref={ref} className={cx("w-full", className)} {...props} />
));
TabsScrollable.displayName = "TabsScrollable";

const TabsListScrollable = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <div className="relative">
    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-ctp-base to-transparent pointer-events-none" />
    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-ctp-base to-transparent pointer-events-none" />
    <div className="overflow-x-auto scrollbar-hide">
      <TabsPrimitive.List
        ref={ref}
        className={cx(
          "inline-flex min-w-full border-b border-ctp-surface0",
          className,
        )}
        {...props}
      />
    </div>
  </div>
));
TabsListScrollable.displayName = "TabsListScrollable";

// Animated tabs with transitions
const TabsAnimated = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ className, ...props }, ref) => (
  <Tabs ref={ref} className={cx("w-full", className)} {...props} />
));
TabsAnimated.displayName = "TabsAnimated";

const TabsContentAnimated = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cx(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "data-[state=inactive]:animate-fadeOut data-[state=active]:animate-fadeIn",
      className,
    )}
    {...props}
  />
));
TabsContentAnimated.displayName = "TabsContentAnimated";

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsWithUnderline,
  TabsListUnderline,
  TabsTriggerUnderline,
  TabsScrollable,
  TabsListScrollable,
  TabsAnimated,
  TabsContentAnimated,
};
