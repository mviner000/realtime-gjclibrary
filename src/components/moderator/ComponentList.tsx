import React from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from '../../../convex/_generated/api';
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Id } from '../../../convex/_generated/dataModel';

const ComponentList = () => {
  const components = useQuery(api.queries.getAllComponentStyles);
  const deleteComponent = useMutation(api.queries.deleteComponentStyle);

  const handleDelete = async (id: Id<"componentStyles">) => {
    try {
      await deleteComponent({ id });
      // No need for manual refresh as Convex will automatically update the UI
    } catch (error) {
      console.error("Failed to delete component:", error);
    }
  };

  if (!components) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="space-y-4 mt-3">
      <h2 className="text-2xl font-bold mb-4">Saved Components</h2>
      {components.length === 0 ? (
        <p className="text-center text-gray-500">No components created yet</p>
      ) : (
        components.map((component) => (
          <Card key={component._id} className="relative">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{component.componentName}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {component.tailwindClasses}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Last updated: {new Date(component.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 hover:bg-red-100"
                  onClick={() => handleDelete(component._id)}
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ComponentList;