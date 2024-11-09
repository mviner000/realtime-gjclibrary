import React, { forwardRef, Ref } from "react";
import QRCodeSVG from "react-qr-code";
import Image from "next/image";

interface QRCodeComponentProps {
  value: string;
  imageSrc?: string;
  imageSize?: number;
}

export type QRCodeComponentRef = {
  toDataURL: () => string;
};

const QRCodeComponent = forwardRef<QRCodeComponentRef, QRCodeComponentProps>(
  ({ value, imageSrc, imageSize = 58 }, ref) => {
    const toDataURL = () => {
      const svg = document.getElementById('qr-code-svg');
      if (svg instanceof SVGSVGElement) {
        const serializer = new XMLSerializer();
        const svgData = serializer.serializeToString(svg);
        return `data:image/svg+xml;base64,${btoa(svgData)}`;
      }
      return '';
    };

    React.useImperativeHandle(ref, () => ({
      toDataURL,
    }));

    return (
      <div className="relative bg-emerald-600 p-4">
        <div className="p-4 bg-white">
          <QRCodeSVG
            value={value}
            size={220}
            bgColor="#ffffff"
            fgColor="#000000"
            id="qr-code-svg"
          />
          {imageSrc && (
            <div className="absolute top-28 right-28">
              <img
                src={imageSrc}
                width={imageSize}
                height={imageSize}
                alt="Decorative Image"
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);

QRCodeComponent.displayName = "QRCodeComponent";

export default QRCodeComponent;