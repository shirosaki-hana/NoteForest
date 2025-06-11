<script lang="ts">
  import Sidebar from './lib/Sidebar.svelte';
  import SidebarToggle from './lib/SidebarToggle.svelte';

  // 사이드바 상태
  let sidebarOpen = false;

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }
</script>

<!-- 사이드바 -->
<Sidebar bind:isOpen={sidebarOpen} />

<!-- 사이드바 토글 버튼 -->
<SidebarToggle onClick={toggleSidebar} isOpen={sidebarOpen} />

<main class:sidebar-open={sidebarOpen}>
  <div class="content">
    <div class="welcome">
      <h1>🌲 NoteForest</h1>
      <p>마크다운 기반 메모 도구</p>
      <div class="features">
        <div class="feature">
          <span class="icon">📝</span>
          <h3>마크다운 지원</h3>
          <p>강력한 마크다운 에디터로 메모를 작성하세요</p>
        </div>
        <div class="feature">
          <span class="icon">🔍</span>
          <h3>빠른 검색</h3>
          <p>메모를 빠르게 찾고 관리하세요</p>
        </div>
        <div class="feature">
          <span class="icon">🌐</span>
          <h3>웹 기반</h3>
          <p>어디서나 접근 가능한 웹 애플리케이션</p>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a3a 50%, #2d2d4f 100%);
    min-height: 100vh;
    color: #f0f0f0;
  }

  :global(*) {
    box-sizing: border-box;
  }

  main {
    min-height: 100vh;
    transition: margin-left 0.3s ease;
  }

  main.sidebar-open {
    margin-left: 320px;
  }

  .content {
    padding: 2rem;
    padding-top: 5rem; /* 토글 버튼 공간 */
  }

  .welcome {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }

  .welcome h1 {
    font-size: 3rem;
    font-weight: 600;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #64b5f6 0%, #81c784 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  .welcome p {
    font-size: 1.2rem;
    color: #a0a0b2;
    margin-bottom: 3rem;
  }

  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .feature {
    background: linear-gradient(145deg, #1e1e2e, #262640);
    padding: 2rem;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 
      0 8px 24px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }

  .feature:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 12px 32px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .feature .icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    display: block;
  }

  .feature h3 {
    color: #f0f0f0;
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .feature p {
    color: #a0a0b2;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0;
  }

  /* 반응형 */
  @media (max-width: 768px) {
    main.sidebar-open {
      margin-left: 0;
    }

    .content {
      padding: 1rem;
      padding-top: 4rem;
    }

    .welcome h1 {
      font-size: 2.5rem;
    }

    .features {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .feature {
      padding: 1.5rem;
    }
  }
</style>
