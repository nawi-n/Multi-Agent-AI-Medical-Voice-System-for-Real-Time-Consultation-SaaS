"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";

function AddNewSessionDialog() {
  const [note, setNote] = useState<string>();
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="mt-3">+ Start a Consultation</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Basic Details</DialogTitle>
          <DialogDescription asChild>
            <div>
              <h2>Add Symptoms or anyother Details</h2>
              <Textarea
                placeholder="Add Details here..."
                className="h-[200px] mt-2 mb-4"
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>
          <Button disabled={!note}>
            Next <ArrowRight />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewSessionDialog;
