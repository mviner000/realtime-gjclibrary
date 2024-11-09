"use client";

import React from "react";
import DownloadButton from "./DownloadButton";

export function DownloadReport() {
    return (
        <div className="flex justify-end p-1">
            <DownloadButton initialDate={new Date()} />
        </div>
    );
}