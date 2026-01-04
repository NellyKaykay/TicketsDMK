<script>
  export let ariaLabel = 'Loading';
</script>

<div class="page-loader" role="status" aria-label={ariaLabel}>
  <div class="spinner"></div>
</div>

<style>
.page-loader {
  position: fixed;
  inset: 0;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid rgba(0,0,0,0.08);
  border-top-color: #38b6ff;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
