<script lang="ts">
  import Sidebar from './lib/Sidebar.svelte';
  import SidebarToggle from './lib/SidebarToggle.svelte';
  import MarkdownEditor from './lib/MarkdownEditor.svelte';

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
    <!-- 마크다운 에디터 -->
    <MarkdownEditor 
      placeholder="마크다운으로 메모를 작성해보세요... 
      
# 제목을 만들려면 # 을 사용하세요
**굵은 글씨**는 별표 두 개로
*기울임체*는 별표 하나로
- 리스트는 대시로 시작하세요"
    />
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
    padding: 1rem;
    padding-top: 5rem; /* 토글 버튼 공간 */
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .content :global(.editor-container) {
    flex: 1;
    min-height: 0; /* flexbox 자식이 넘치지 않도록 */
  }
  /* 반응형 */
  @media (max-width: 768px) {
    main.sidebar-open {
      margin-left: 0;
    }

    .content {
      padding: 0.75rem;
      padding-top: 4rem;
    }
  }
</style>
