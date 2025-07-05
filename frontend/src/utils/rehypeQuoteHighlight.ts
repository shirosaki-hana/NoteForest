import { visit } from 'unist-util-visit'
import type { Root, Element, Text, ElementContent } from 'hast'

// 따옴표 패턴 (Microsoft Word 스마트 따옴표 포함)
const QUOTE_PATTERN = /"([^"]+)"|'([^']+)'|"([^"]+)"|'([^']+)'|\u201C([^\u201D]+)\u201D|\u2018([^\u2019]+)\u2019/g

export default function rehypeQuoteHighlight() {
  return (tree: Root) => {
    visit(tree, 'text', (node: Text, index, parent) => {
      const originalText = node.value
      
      // 새로운 정규 표현식 인스턴스를 생성
      const testRegex = new RegExp(QUOTE_PATTERN.source, 'g')
      
      // 따옴표 패턴이 있는지 확인
      if (testRegex.test(originalText)) {
        // 실제 replace를 위한 새로운 정규 표현식 인스턴스
        const replaceRegex = new RegExp(QUOTE_PATTERN.source, 'g')
        
        // 텍스트를 분할하여 처리
        const parts: ElementContent[] = []
        let lastIndex = 0
        let match
        
        while ((match = replaceRegex.exec(originalText)) !== null) {
          // 매칭 전 텍스트가 있으면 추가
          if (match.index > lastIndex) {
            const textNode: Text = {
              type: 'text',
              value: originalText.slice(lastIndex, match.index)
            }
            parts.push(textNode)
          }
          
          // 하이라이트된 부분 추가
          const highlightElement: Element = {
            type: 'element',
            tagName: 'span',
            properties: {
              className: ['quote-highlight']
            },
            children: [{
              type: 'text',
              value: match[0]
            } as Text]
          }
          parts.push(highlightElement)
          
          lastIndex = match.index + match[0].length
        }
        
        // 남은 텍스트가 있으면 추가
        if (lastIndex < originalText.length) {
          const textNode: Text = {
            type: 'text',
            value: originalText.slice(lastIndex)
          }
          parts.push(textNode)
        }
        
        // 부모 노드에서 현재 노드를 새로운 노드들로 교체
        if (parent && typeof index === 'number') {
          parent.children.splice(index, 1, ...parts)
        }
      }
    })
  }
} 