<script lang="ts">
  import { onMount } from 'svelte';
  import { getNoteList, type NoteFile } from '../utils/api';

  // Props
  export let isOpen = false;

  // State
  let notes: NoteFile[] = [];
  let loading = false;
  let error = '';

  // 사이드바 토글 함수
  export function toggle() {
    isOpen = !isOpen;
  }

  // 메모 리스트 로드
  async function loadNotes() {
    loading = true;
    error = '';
    
    try {
      const response = await getNoteList();
      if (response.success) {
        notes = response.data;
      } else {
        error = '메모를 불러올 수 없습니다.';
      }
    } catch (err) {
      error = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
    } finally {
      loading = false;
    }
  }

  // 메모 선택 함수 (나중에 사용)
  function selectNote(note: NoteFile) {
    console.log('선택된 메모:', note.name);
    // TODO: 에디터에 메모 로드
  }

  // 컴포넌트 마운트 시 메모 리스트 로드
  onMount(() => {
    loadNotes();
  });
</script>

<!-- 사이드바 배경 오버레이 (모바일용) -->
{#if isOpen}
  <div class="sidebar-overlay" on:click={toggle} on:keydown={toggle} role="button" tabindex="0"></div>
{/if}

<!-- 사이드바 -->
<aside class="sidebar" class:open={isOpen}>
  <!-- 헤더 -->
  <div class="sidebar-header">
    <div class="logo">
      <span class="logo-icon">🌲</span>
      <h2>NoteForest</h2>
    </div>
    <button class="close-btn" on:click={toggle} aria-label="사이드바 닫기">
      <span class="close-icon">×</span>
    </button>
  </div>

  <!-- 메모 리스트 -->
  <div class="sidebar-content">
    <div class="section-header">
      <h3>메모 목록</h3>
      <button class="refresh-btn" on:click={loadNotes} disabled={loading} aria-label="새로고침">
        <span class="refresh-icon" class:spinning={loading}>🔄</span>
      </button>
    </div>

    {#if loading}
      <div class="loading">
        <div class="loading-spinner"></div>
        <p>메모를 불러오는 중...</p>
      </div>
    {:else if error}
      <div class="error">
        <p>⚠️ {error}</p>
        <button class="retry-btn" on:click={loadNotes}>다시 시도</button>
      </div>
    {:else if notes.length === 0}
      <div class="empty">
        <p>📝 메모가 없습니다</p>
        <p class="empty-subtitle">새 메모를 작성해보세요!</p>
      </div>
    {:else}
      <ul class="note-list">
        {#each notes as note (note.filename)}
          <li class="note-item">
            <button class="note-button" on:click={() => selectNote(note)}>
              <div class="note-info">
                <h4 class="note-title">{note.name}</h4>
                <p class="note-date">
                  {new Date(note.lastModified).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <span class="note-arrow">→</span>
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</aside>

<style>
  /* 사이드바 오버레이 */
  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
    backdrop-filter: blur(2px);
  }

  /* 사이드바 메인 */
  .sidebar {
    position: fixed;
    top: 0;
    left: -320px;
    width: 320px;
    height: 100vh;
    background: linear-gradient(145deg, #1e1e2e, #262640);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    z-index: 999;
    transition: left 0.3s ease;
    display: flex;
    flex-direction: column;
    backdrop-filter: blur(10px);
  }

  .sidebar.open {
    left: 0;
  }

  /* 헤더 */
  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.02);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .logo-icon {
    font-size: 1.5rem;
  }

  .logo h2 {
    color: #f0f0f0;
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
  }

  .close-btn {
    background: none;
    border: none;
    color: #a0a0b2;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 6px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #f0f0f0;
  }

  .close-icon {
    line-height: 1;
  }

  /* 콘텐츠 */
  .sidebar-content {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .section-header h3 {
    color: #f0f0f0;
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
  }

  .refresh-btn {
    background: none;
    border: none;
    color: #a0a0b2;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: all 0.2s ease;
    font-size: 0.875rem;
  }

  .refresh-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    color: #f0f0f0;
  }

  .refresh-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .refresh-icon {
    display: inline-block;
    transition: transform 0.3s ease;
  }

  .refresh-icon.spinning {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* 로딩 상태 */
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 1rem;
    color: #a0a0b2;
  }

  .loading-spinner {
    width: 24px;
    height: 24px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-top: 2px solid #64b5f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  /* 에러 상태 */
  .error {
    padding: 1rem;
    text-align: center;
    color: #ef5350;
  }

  .retry-btn {
    background: linear-gradient(135deg, #ef5350, #f44336);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    transition: all 0.2s ease;
  }

  .retry-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
  }

  /* 빈 상태 */
  .empty {
    padding: 2rem 1rem;
    text-align: center;
    color: #a0a0b2;
  }

  .empty-subtitle {
    font-size: 0.875rem;
    margin-top: 0.5rem;
    opacity: 0.7;
  }

  /* 메모 리스트 */
  .note-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .note-item {
    margin-bottom: 0.5rem;
  }

  .note-button {
    width: 100%;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
  }

  .note-button:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(100, 181, 246, 0.3);
    transform: translateX(4px);
  }

  .note-info {
    flex: 1;
    min-width: 0;
  }

  .note-title {
    color: #f0f0f0;
    font-size: 0.9rem;
    font-weight: 500;
    margin: 0 0 0.25rem 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .note-date {
    color: #a0a0b2;
    font-size: 0.75rem;
    margin: 0;
  }

  .note-arrow {
    color: #64b5f6;
    font-size: 0.875rem;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .note-button:hover .note-arrow {
    opacity: 1;
  }

  /* 스크롤바 스타일링 */
  .sidebar-content::-webkit-scrollbar {
    width: 6px;
  }

  .sidebar-content::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }

  .sidebar-content::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }

  .sidebar-content::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  /* 반응형 */
  @media (max-width: 768px) {
    .sidebar {
      width: 280px;
    }
  }
</style>
