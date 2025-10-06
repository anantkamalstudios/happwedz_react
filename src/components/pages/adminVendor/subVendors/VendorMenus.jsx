import React from "react";

// Simple Menus manager for Caterers: add menu name, price, items, type (veg/non-veg)
const VendorMenus = ({ formData, setFormData, onSave }) => {
  // Always use menus from formData.attributes.menus
  const menus = Array.isArray(formData.attributes?.menus)
    ? formData.attributes.menus
    : [
        {
          title: "",
          price: "",
          type: "veg", // default type
          items: [""],
        },
      ];

  // Update only attributes.menus, never root menus
  const setMenus = (next) =>
    setFormData((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        menus: next,
      },
    }));

  const handleMenuField = (index, field, value) => {
    const next = menus.map((m, i) =>
      i === index ? { ...m, [field]: value } : m
    );
    setMenus(next);
  };

  const handleItemChange = (menuIndex, itemIndex, value) => {
    const next = menus.map((m, i) =>
      i === menuIndex
        ? {
            ...m,
            items: m.items.map((it, j) => (j === itemIndex ? value : it)),
          }
        : m
    );
    setMenus(next);
  };

  const addMenu = () =>
    setMenus([...menus, { title: "", price: "", type: "veg", items: [""] }]);
  const removeMenu = (index) => setMenus(menus.filter((_, i) => i !== index));
  const addItem = (menuIndex) => {
    const next = menus.map((m, i) =>
      i === menuIndex ? { ...m, items: [...m.items, ""] } : m
    );
    setMenus(next);
  };
  const removeItem = (menuIndex, itemIndex) => {
    const next = menus.map((m, i) =>
      i === menuIndex
        ? { ...m, items: m.items.filter((_, j) => j !== itemIndex) }
        : m
    );
    setMenus(next);
  };

  // Ensure menus are always up to date in formData before saving
  const handleSaveMenus = () => {
    setFormData((prev) => {
      // Store menus only in attributes for backend compatibility
      const newMenus = menus.map((m) => ({
        title: m.title,
        price: m.price,
        type: m.type,
        items: m.items,
      }));
      return {
        ...prev,
        // Remove menus from root, only keep in attributes
        attributes: {
          ...prev.attributes,
          menus: newMenus,
        },
      };
    });
    if (onSave) onSave();
  };

  return (
    <div className="my-5">
      <div className="p-3 border rounded bg-white">
        <h6 className="mb-3 fw-bold">Menus (for Caterers)</h6>
        {menus.map((menu, index) => (
          <div key={index} className="border rounded p-3 mb-3 bg-light">
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">Menu Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={menu.title}
                  onChange={(e) =>
                    handleMenuField(index, "title", e.target.value)
                  }
                  placeholder="e.g., Veg Silver, Non-Veg Gold"
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold">Type</label>
                <select
                  className="form-select"
                  value={menu.type || "veg"}
                  onChange={(e) =>
                    handleMenuField(index, "type", e.target.value)
                  }
                >
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-Veg</option>
                </select>
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold">
                  Price (per plate)
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={menu.price}
                  onChange={(e) =>
                    handleMenuField(index, "price", e.target.value)
                  }
                  placeholder="e.g., 650"
                />
              </div>
              <div className="col-md-2 mb-3 d-flex align-items-end">
                <button
                  className="btn btn-outline-danger w-100"
                  onClick={() => removeMenu(index)}
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="mb-2 fw-semibold">Items</div>
            {menu.items.map((it, itemIdx) => (
              <div className="row mb-2" key={itemIdx}>
                <div className="col-md-10">
                  <input
                    type="text"
                    className="form-control"
                    value={it}
                    onChange={(e) =>
                      handleItemChange(index, itemIdx, e.target.value)
                    }
                    placeholder="e.g., Paneer Tikka"
                  />
                </div>
                <div className="col-md-2">
                  <button
                    className="btn btn-outline-danger w-100"
                    onClick={() => removeItem(index, itemIdx)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => addItem(index)}
            >
              Add Item
            </button>
          </div>
        ))}
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={addMenu}>
            Add Menu
          </button>
          <button className="btn btn-primary" onClick={handleSaveMenus}>
            Save Menus
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorMenus;
