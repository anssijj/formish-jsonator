
export const sanitizeValue = (value: string) => {
  return value.trim().toLowerCase().replace(/[^a-zA-Z0-9\s_-]/g, '').replace(/\s+/g, '_');
};

export const generateRequiredAttributes = (required: boolean) => {
  const requiredAttr = required ? " required" : "";
  const requiredStar = required ? "<span class=\"required\">*</span>" : "";
  return { requiredAttr, requiredStar };
};

export const generateElementHtml = (element: {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
  optionValues?: string[];
  accept?: string;
}) => {
  const { id } = element;
  const { requiredAttr, requiredStar } = generateRequiredAttributes(element.required);

  switch (element.type) {
    case "file":
      return `<div class="form-group">
  <label for="${id}">${element.label}${requiredStar}</label>
  <input type="file" id="${id}" name="${id}" accept="${element.accept}"${requiredAttr}>
</div>`;

    case "select":
      return `<div class="form-group">
  <label for="${id}">${element.label}${requiredStar}</label>
  <select id="${id}" name="${id}"${requiredAttr}>
    ${(element.options || [])
      .map((opt, index) => {
        const value = element.optionValues?.[index] || sanitizeValue(opt);
        return `    <option value="${value}">${opt}</option>`;
      })
      .join("\n")}
  </select>
</div>`;

    case "radio":
      return `<div class="form-group">
  <label>${element.label}${requiredStar}</label>
  ${(element.options || [])
    .map((opt, index) => {
      const value = element.optionValues?.[index] || sanitizeValue(opt);
      return `  <div>
    <input type="radio" id="${id}_${value}" name="${id}" value="${value}"${requiredAttr}>
    <label for="${id}_${value}">${opt}</label>
  </div>`;
    })
    .join("\n")}
</div>`;

    case "checkbox":
      return `<div class="form-group">
  <input type="checkbox" id="${id}" name="${id}"${requiredAttr}>
  <label for="${id}">${element.label}</label>
</div>`;

    case "textarea":
      return `<div class="form-group">
  <label for="${id}">${element.label}${requiredStar}</label>
  <textarea id="${id}" name="${id}"${requiredAttr}></textarea>
</div>`;

    default:
      return `<div class="form-group">
  <label for="${id}">${element.label}${requiredStar}</label>
  <input type="${element.type}" id="${id}" name="${id}"${requiredAttr}>
</div>`;
  }
};

