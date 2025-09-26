
interface FormElement {
  id: string;
  label: string;
  showWhen?: {
    field: string;
    value: string;
  };
}

const sanitizeValue = (value: string) => {
  return value.trim().toLowerCase().replace(/[^a-zA-Z0-9\s_-]/g, '').replace(/\s+/g, '_');
};

export const generateConditionalScript = (elements: FormElement[]) => {
  const conditionalFields = elements.filter(el => el.showWhen);
  
  if (conditionalFields.length === 0) {
    return '';
  }

  return `
<script>
document.addEventListener('DOMContentLoaded', function() {
  const formValues = {};
  
  function updateVisibility() {
    ${conditionalFields.map(element => {
      const fieldName = sanitizeValue(element.label);
      const controllingFieldName = elements.find(el => el.id === element.showWhen?.field)?.label;
      const controllingFieldSanitized = controllingFieldName ? sanitizeValue(controllingFieldName) : element.showWhen?.field;
      
      return `
    // Conditional display for ${fieldName}
    {
      const field = document.getElementById('${fieldName}').closest('.form-group');
      const controllingField = document.getElementById('${controllingFieldSanitized}');
      const shouldShow = controllingField.value === '${element.showWhen?.value}';
      field.classList.toggle('hidden', !shouldShow);
    }`;
    }).join('\n')}
  }

  // Add change event listeners to all controlling fields
  ${[...new Set(conditionalFields.map(el => {
    const controllingFieldName = elements.find(elem => elem.id === el.showWhen?.field)?.label;
    return controllingFieldName ? sanitizeValue(controllingFieldName) : el.showWhen?.field;
  }))].map(fieldId => `
  document.getElementById('${fieldId}')?.addEventListener('change', function(e) {
    formValues['${fieldId}'] = e.target.value;
    updateVisibility();
  });`).join('\n')}

  // Initial visibility check
  updateVisibility();
});
</script>`;
};

