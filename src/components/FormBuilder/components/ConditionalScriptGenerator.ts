
interface FormElement {
  id: string;
  showWhen?: {
    field: string;
    value: string;
  };
}

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
    ${conditionalFields.map(element => `
    // Conditional display for ${element.id}
    {
      const field = document.getElementById('${element.id}').closest('.form-group');
      const controllingField = document.getElementById('${element.showWhen?.field}');
      const shouldShow = controllingField.value === '${element.showWhen?.value}';
      field.classList.toggle('hidden', !shouldShow);
    }`).join('\n')}
  }

  // Add change event listeners to all controlling fields
  ${[...new Set(conditionalFields.map(el => el.showWhen?.field))].map(fieldId => `
  document.getElementById('${fieldId}')?.addEventListener('change', function(e) {
    formValues['${fieldId}'] = e.target.value;
    updateVisibility();
  });`).join('\n')}

  // Initial visibility check
  updateVisibility();
});
</script>`;
};

