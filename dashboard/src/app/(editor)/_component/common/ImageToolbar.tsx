"use client";

import React, { useRef, ChangeEvent, useEffect } from "react";
import { useMyContext } from "@/Context/EditorContext";
import CustomSelect from "@/app/_common/CustomSelect";
import ImageSelector from "./ImageSelector";

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
  const { imageContext, setImageEdit, setImageContext, contextRef, activeScreen } = useMyContext();

  if (!imageContext || !("element" in imageContext)) return null;

  const { element, style = {}, setElement, onClose, rmElement, imageRef, setSrcFn, openSelector } = imageContext;

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
      <label className="text-xs font-medium mb-1 text-stone-700 dark:text-stone-300">{label}</label>
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
        [activeScreen]: {
          ...prev.style?.[activeScreen],
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
      const prevStyle = prev.style?.[activeScreen] || {};
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
          [activeScreen]: {
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
        [activeScreen]: {
          ...prev.style?.[activeScreen],
          position: value,
          top: "20px",
          left: "20px",
          zIndex: "1"
        },
      },
    }));
  };

  const handleObjectFit = (value: string) => {
    setElement((prev: any) => ({
      ...prev,
      style: {
        ...prev.style,
        [activeScreen]: {
          ...prev.style?.[activeScreen],
          objectFit: value
        },
      },
    }));
  }

  const handleObjectSize = (value: string) => {
    setElement((prev: any) => ({
      ...prev,
      style: {
        ...prev.style,
        [activeScreen]: {
          ...prev.style?.[activeScreen],
          objectPosition: value
        },
      },
    }));
  }

  const removeElement = () => {
    setImageEdit(false)
    setImageContext(null)
    contextRef.setReference(null)
    rmElement()
  }

  const closeSelector = () => {
    setImageContext((prev) => {
      return ({ ...prev, openSelector: false })
    })
  }

  const handleShadowChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setElement((prev: any) => ({
      ...prev,
      style: {
        ...prev.style,
        [activeScreen]: {
          ...prev.style?.[activeScreen],
          boxShadow: boxShadowPresets[value],
        },
      },
    }));
  };

  const handleQuickRotate = (deg: number) => {
    setElement((prev: any) => {
      const prevStyle = prev.style?.[activeScreen] || {};

      return {
        ...prev,
        style: {
          ...prev.style,
          [activeScreen]: {
            ...prevStyle,
            transform: `rotate(${deg}deg)`,
          },
        },
      };
    });
  };


  // useEffect(() => {
  //   function handleClickOutside(event: MouseEvent) {
  //     if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node) &&
  //       !imageRef.current.contains(event.target as Node)) {
  //       onClose();
  //       setImageEdit(false)
  //     }
  //   }
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [onClose]);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      const clickedInsideToolbar = toolbarRef.current?.contains(target);
      const clickedOnActiveImage = imageRef.current?.contains(target);

      // ✅ NEW: check if clicked on any image element
      const clickedOnAnyImage = (target instanceof HTMLElement) && target.closest("img");

      if (!clickedInsideToolbar && !clickedOnActiveImage && !clickedOnAnyImage) {
        onClose();
        setImageEdit(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, setImageEdit, imageRef]);


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

      {renderInputRow("Width:", style?.[activeScreen]?.width, "text", handleInputStyles("width"))}

      {renderInputRow("Height:", style?.[activeScreen]?.height, "text", handleInputStyles("height"))}

      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 mb-[-10px]">Image Fit</label>
      <CustomSelect
        options={[
          { value: "cover", label: "Cover" },
          { value: "contain", label: "Contain" },
          { value: "fill", label: "Fill" },
        ]}
        Default={style?.[activeScreen]?.position}
        onChange={(value) => handleObjectFit(value)}
        firstOption="Default"
        firstValue="auto"
      />

      <CustomSelect
        options={[
          { value: "left top", label: "left top" },
          { value: "left center", label: "left center" },
          { value: "left bottom", label: "left bottom" },

          { value: "center top", label: "center top" },
          { value: "center center", label: "center center" },
          { value: "center bottom", label: "center bottom" },

          { value: "right top", label: "right top" },
          { value: "right center", label: "right center" },
          { value: "right bottom", label: "right bottom" }
        ]}
        Default={style?.[activeScreen]?.position}
        onChange={(value) => handleObjectSize(value)}
        firstOption="Default"
        firstValue="auto"
      />

      <div>
        <label className="text-xs font-bold text-gray-700 dark:text-gray-200">Margin</label>
        <div className="grid grid-cols-2 gap-2">

          {renderInputRow("Top:", style?.[activeScreen]?.marginTop, "text", handleInputStyles("marginTop"))}
          {renderInputRow("Bottom:", style?.[activeScreen]?.marginBottom, "text", handleInputStyles("marginBottom"))}
          {renderInputRow("Left:", style?.[activeScreen]?.marginLeft, "text", handleInputStyles("marginLeft"))}
          {renderInputRow("Right:", style?.[activeScreen]?.marginRight, "text", handleInputStyles("marginRight"))}
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-700 dark:text-gray-200">Padding</label>
        <div className="grid grid-cols-2 gap-2">
          {renderInputRow("Top:", style?.[activeScreen]?.paddingTop, "text", handleInputStyles("paddingTop"))}
          {renderInputRow("Bottom:", style?.[activeScreen]?.paddingBottom, "text", handleInputStyles("paddingBottom"))}
          {renderInputRow("Left:", style?.[activeScreen]?.paddingLeft, "text", handleInputStyles("paddingLeft"))}
          {renderInputRow("Right:", style?.[activeScreen]?.paddingRight, "text", handleInputStyles("paddingRight"))}
        </div>
      </div>


      {renderInputRow("Radius:", style?.[activeScreen]?.borderRadius, "text", handleInputStyles("borderRadius"))}

      <div className="flex flex-col">
        {/* <label className="text-sm font-medium mb-1 text-stone-700 dark:text-stone-300">Box Shadow:</label> */}
        <h4 className="font-semibold border-t pt-2 text-stone-700 dark:text-stone-300">Box Shadow</h4>

        <select
          className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={
            Object.entries(boxShadowPresets).find(([, val]) => val === style?.[activeScreen]?.boxShadow)?.[0] || "none"
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
        parseFloat(style?.[activeScreen]?.filter?.match(/grayscale\(([^)]+)\)/)?.[1]?.replace('%', '') || "0") / 100, // normalize
        "range",
        (val) => handleFilterChange("grayscale")(val), // val is 0–1
        "0",
        "1",
        "0.1"
      )}

      {renderInputRow(
        "Brightness:",
        parseFloat(
          style?.[activeScreen]?.filter?.match(/brightness\(([^)]+)\)/)?.[1] || "1"
        ),
        "range",
        (val) => handleFilterChange("brightness")(val),
        "0",
        "2",
        "0.1"
      )}

      <h4 className="font-semibold border-t pt-2 text-stone-700 dark:text-stone-300">Position</h4>

      <CustomSelect
        options={[
          // { value: "relative", label: "Just Stack" },
          { value: "absolute", label: "Drag" }
        ]}
        Default={style?.[activeScreen]?.position}
        onChange={(value) => handlePositionChange(value)}
        firstOption="No Drag"
        firstValue="static"
      />
      {renderInputRow("Stack Index:", style?.[activeScreen]?.zIndex, "number", handleInputStyles("zIndex"))}
      {renderInputRow("top:", style?.[activeScreen]?.top, "text", handleInputStyles("top"))}
      {renderInputRow("left:", style?.[activeScreen]?.left, "text", handleInputStyles("left"))}

      <h4 className="font-semibold border-t pt-2 text-stone-700 dark:text-stone-300">Quick Rotate</h4>
      <div className="flex gap-2 flex-wrap">
        {[0, 45, 90, 135, 180].map((deg) => (
          <button
            key={deg}
            onClick={() => handleQuickRotate(deg)}
            className="px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 
                 dark:bg-zinc-700 dark:hover:bg-zinc-600 
                 border text-sm"
          >
            {deg}°
          </button>
        ))}
      </div>

      {/* Image Selector Modal */}
      {openSelector && (
        <ImageSelector
          onSelectImage={setSrcFn}
          onClose={() => closeSelector()}
          type="IMAGE"
        />
      )}
    </div>
  );
};

export default ImageStyleToolbar;