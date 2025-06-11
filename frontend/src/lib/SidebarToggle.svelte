<script lang="ts">
  // Props
  export let onClick: () => void;
  export let isOpen = false;
</script>

<button class="sidebar-toggle" on:click={onClick} aria-label="사이드바 토글">
  <span class="hamburger" class:open={isOpen}>
    <span class="line"></span>
    <span class="line"></span>
    <span class="line"></span>
  </span>
</button>

<style>
  .sidebar-toggle {
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 1000;
    background: linear-gradient(145deg, #1e1e2e, #262640);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0.75rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 
      0 8px 24px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }

  .sidebar-toggle:hover {
    background: linear-gradient(145deg, #262640, #2d2d4f);
    transform: translateY(-2px);
    box-shadow: 
      0 12px 32px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .hamburger {
    display: flex;
    flex-direction: column;
    width: 20px;
    height: 16px;
    justify-content: space-between;
    transition: transform 0.3s ease;
  }

  .hamburger.open {
    transform: rotate(45deg);
  }

  .line {
    height: 2px;
    background: #f0f0f0;
    border-radius: 1px;
    transition: all 0.3s ease;
    transform-origin: center;
  }

  .hamburger.open .line:nth-child(1) {
    transform: rotate(90deg) translateY(7px);
  }

  .hamburger.open .line:nth-child(2) {
    opacity: 0;
  }

  .hamburger.open .line:nth-child(3) {
    transform: rotate(90deg) translateY(-7px);
  }
</style>
