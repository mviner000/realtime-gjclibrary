import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonRow = () => (
  <div className="flex justify-between items-center py-2">
    <Skeleton className="h-4 w-1/3" />
    <Skeleton className="h-4 w-1/2" />
  </div>
);

const SkeletonAccordionContent = () => (
  <div className="space-y-2">
    {[...Array(4)].map((_, i) => (
      <SkeletonRow key={i} />
    ))}
    <Skeleton className="h-4 w-1/4 mt-4" />
    <div className="space-y-2 mt-2">
      {[...Array(2)].map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  </div>
);

export default function BookTransactionsSkeletonLoader() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-3/4" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {[...Array(3)].map((_, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>
                <Skeleton className="h-4 w-full" />
              </AccordionTrigger>
              <AccordionContent>
                <SkeletonAccordionContent />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
