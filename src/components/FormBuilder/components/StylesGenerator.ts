
export const generateStyles = () => `
<style>
  .form-group { margin-bottom: 1rem; }
  label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #374151; }
  input[type="text"], input[type="email"], input[type="tel"], input[type="number"], input[type="date"], 
  select, textarea { 
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background-color: white;
    font-size: 0.875rem;
  }
  input:focus, select:focus, textarea:focus {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
  .submit-button {
    background-color: #2563eb;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  .submit-button:hover {
    background-color: #1d4ed8;
  }
  .required { color: #ef4444; margin-left: 0.25rem; }
  .hidden { display: none !important; }
</style>`;

