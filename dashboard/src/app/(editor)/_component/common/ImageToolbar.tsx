"use client";

import React, { useRef, ChangeEvent, useEffect } from "react";
import { useMyContext } from "@/Context/EditorContext";
import CustomSelect from "@/app/_common/CustomSelect";

type StyleObject = React.CSSProperties;

interface ElementType {
  id: string;
  alt?: string;
  style?: Record<string, StyleObject>;
  [key: string]: any;
}

const boxShadowPresets: Record<string, string> = {
  none: "none",
  sm: "1px 1px 3px rgba(0,0,0,0.1)",
  md: "2px 2px 6px rgba(0,0,0,0.15)",
  lg: "4px 4px 12px rgba(0,0,0,0.2)",
  xl: "6px 6px 20px rgba(0,0,0,0.25)",
  "dark-sm": "1px 1px 3px rgba(0,0,0,0.4)",
  "dark-md": "2px 2px 6px rgba(0,0,0,0.5)",
  "dark-lg": "4px 4px 12px rgba(0,0,0,0.6)",
  "dark-xl": "6px 6px 20px rgba(0,0,0,0.7)",
};

const ImageStyleToolbar: React.FC = () => {
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const { imageContext, setImageEdit, setImageContext, contextRef } = useMyContext();

  if (!imageContext || !("element" in imageContext)) return null;

  const { element, style = {}, setElement, currentWidth, onClose, rmElement, imageRef } = imageContext;

  // Unified input row with Tailwind styling
  const renderInputRow = (
    label: string,
    value: string | number = "",
    type: "text" | "range" | "number" = "text",
    handleInput: (value: string) => void,
    min?: string,
    max?: string,
    step?: string
  ) => (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1 text-stone-700 dark:text-stone-300">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => handleInput(e.target.value)}
        className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        min={min || 0}
        max={max}
        step={step}
      />
    </div>
  );

  const handleInputStyles = (name: keyof StyleObject) => (value: string) => {

    setElement((prev: any) => ({
      ...prev,
      style: {
        ...prev.style,
        [currentWidth]: {
          ...prev.style?.[currentWidth],
          [name]: value,
        },
      },
    }));
  };

  const handleInputValue = (name: keyof ElementType) => (value: string) => {
    setElement((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterChange = (filterName: string) => (value: string) => {
    setElement((prev: any) => {
      const prevStyle = prev.style?.[currentWidth] || {};
      const prevFilter = prevStyle.filter || "";

      const filters = Object.fromEntries(
        prevFilter
          .split(" ")
          .map((f: any) => f.trim().match(/^(\w+)\(([^)]+)\)$/))
          .filter(Boolean)
          .map(([, name, val]: any) => [name, val])
      );

      let newVal = value;
      if (filterName === "grayscale") {
        newVal = `${parseFloat(value) * 100}%`; // keep 0–1 in slider, convert to %
      } else if (filterName === "brightness") {
        newVal = value; // keep as-is
      }

      filters[filterName] = newVal;

      return {
        ...prev,
        style: {
          ...prev.style,
          [currentWidth]: {
            ...prevStyle,
            filter: Object.entries(filters)
              .map(([name, val]) => `${name}(${val})`)
              .join(" "),
          },
        },
      };
    });
  };



  const handlePositionChange = (value: string) => {

    setElement((prev: any) => ({
      ...prev,
      style: {
        ...prev.style,
        [currentWidth]: {
          ...prev.style?.[currentWidth],
          position: value,
          top: "20px",
          left: "20px",
          zIndex: "1"
        },
      },
    }));
  };

  const removeElement = () => {
    setImageEdit(false)
    setImageContext(null)
    contextRef.setReference(null)
    rmElement()
  }

  const handleShadowChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setElement((prev: any) => ({
      ...prev,
      style: {
        ...prev.style,
        [currentWidth]: {
          ...prev.style?.[currentWidth],
          boxShadow: boxShadowPresets[value],
        },
      },
    }));
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node) &&
        !imageRef.current.contains(event.target as Node)) {
        onClose();
        setImageEdit(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={toolbarRef}
      className="bg-white dark:bg-zinc-900 text-sm text-stone-800 dark:text-stone-200 p-4 rounded-[0px_0px_1px_1px] w-[280px] max-w-[22vw] shadow-md transition-all duration-100 ease-in-out flex flex-col gap-4 z-[var(--zIndex)]"
      style={{ width: "240px" }}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <h3 className="font-bold border-t pt-2">Image Style Controls</h3>

      <button onClick={removeElement}
        className="px-3 py-2 rounded-md bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium border border-red-300 dark:bg-red-800 dark:border-red-600 dark:text-red-100">
        Remove this Image</button>

      {renderInputRow("Alternate text:", element.alt || "", "text", handleInputValue("alt"))}

      {renderInputRow("Width:", style?.[currentWidth].width, "text", handleInputStyles("width"))}

      {renderInputRow("Height:", style?.[currentWidth].height, "text", handleInputStyles("height"))}

      {renderInputRow("Margin Top:", style?.[currentWidth].marginTop, "text", handleInputStyles("marginTop"))}
      {renderInputRow("Margin Bottom:", style?.[currentWidth].marginBottom, "text", handleInputStyles("marginBottom"))}
      {renderInputRow("Margin Left:", style?.[currentWidth].marginLeft, "text", handleInputStyles("marginLeft"))}
      {renderInputRow("Margin Right:", style?.[currentWidth].marginRight, "text", handleInputStyles("marginRight"))}


      {renderInputRow("Radius:", style?.[currentWidth].borderRadius, "text", handleInputStyles("borderRadius"))}

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 text-stone-700 dark:text-stone-300">Box Shadow:</label>
        <select
          className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={
            Object.entries(boxShadowPresets).find(([, val]) => val === style.boxShadow)?.[0] || "none"
          }
          onChange={handleShadowChange}
        >
          <optgroup label="Light Shadows">
            <option value="none">None</option>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
            <option value="xl">Extra Large</option>
          </optgroup>
          <optgroup label="Dark Shadows">
            <option value="dark-sm">Dark Small</option>
            <option value="dark-md">Dark Medium</option>
            <option value="dark-lg">Dark Large</option>
            <option value="dark-xl">Dark Extra Large</option>
          </optgroup>
        </select>
      </div>

      <h4 className="font-semibold border-t pt-2 text-stone-700 dark:text-stone-300">Filters</h4>

      {renderInputRow(
        "Grayscale:",
        parseFloat(style?.[currentWidth]?.filter?.match(/grayscale\(([^)]+)\)/)?.[1]?.replace('%', '') || "0") / 100, // normalize
        "range",
        (val) => handleFilterChange("grayscale")(val), // val is 0–1
        "0",
        "1",
        "0.1"
      )}

      {renderInputRow(
        "Brightness:",
        parseFloat(
          style?.[currentWidth]?.filter?.match(/brightness\(([^)]+)\)/)?.[1] || "1"
        ),
        "range",
        (val) => handleFilterChange("brightness")(val),
        "0",
        "2",
        "0.1"
      )}

      <CustomSelect
        options={[
          { value: "relative", label: "Soft Drag" },
          // { value: "absolute", label: "Hard Drag" }
        ]}
        Default={style?.[currentWidth].position}
        onChange={(value) => handlePositionChange(value)}
        firstOption="No"
        firstValue="static"
      />
      {renderInputRow("Stack Index:", style?.[currentWidth].zIndex, "number", handleInputStyles("zIndex"))}
      {renderInputRow("top:", style?.[currentWidth].top, "text", handleInputStyles("top"))}
      {renderInputRow("left:", style?.[currentWidth].left, "text", handleInputStyles("left"))}


    </div>
  );
};

export default ImageStyleToolbar;
