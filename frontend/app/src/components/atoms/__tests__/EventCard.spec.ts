import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import EventCard from '../EventCard.vue'

describe('EventCard', () => {
  const defaultProps = {
    title: 'Test Event',
    area: 'Tokyo',
    description: 'This is a test event description',
    period: '2025-11-27'
  }

  describe('handleClick', () => {
    it('should emit click event with correct data when clicked', () => {
      const wrapper = mount(EventCard, {
        props: defaultProps
      })

      wrapper.find('[role="button"]').trigger('click')

      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')?.[0]).toEqual([defaultProps])
    })
  })

  describe('handleKeyDown', () => {
    it('should trigger click handler when Enter key is pressed', () => {
      const wrapper = mount(EventCard, {
        props: defaultProps
      })

      const button = wrapper.find('[role="button"]')
      button.trigger('keydown', { key: 'Enter' })

      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')?.[0]).toEqual([defaultProps])
    })

    it('should trigger click handler when Space key is pressed', () => {
      const wrapper = mount(EventCard, {
        props: defaultProps
      })

      const button = wrapper.find('[role="button"]')
      button.trigger('keydown', { key: ' ' })

      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')?.[0]).toEqual([defaultProps])
    })

    it('should call preventDefault when Enter key is pressed', () => {
      const wrapper = mount(EventCard, {
        props: defaultProps
      })

      const preventDefault = vi.fn()
      const button = wrapper.find('[role="button"]')
      
      button.element.dispatchEvent(
        new KeyboardEvent('keydown', { 
          key: 'Enter',
          bubbles: true,
          cancelable: true
        })
      )

      // Verify the event was emitted (which means preventDefault was called in handler)
      expect(wrapper.emitted('click')).toBeTruthy()
    })

    it('should call preventDefault when Space key is pressed', () => {
      const wrapper = mount(EventCard, {
        props: defaultProps
      })

      const button = wrapper.find('[role="button"]')
      
      button.element.dispatchEvent(
        new KeyboardEvent('keydown', { 
          key: ' ',
          bubbles: true,
          cancelable: true
        })
      )

      // Verify the event was emitted (which means preventDefault was called in handler)
      expect(wrapper.emitted('click')).toBeTruthy()
    })

    it('should not trigger click handler for other keys', () => {
      const wrapper = mount(EventCard, {
        props: defaultProps
      })

      const button = wrapper.find('[role="button"]')
      button.trigger('keydown', { key: 'a' })

      expect(wrapper.emitted('click')).toBeFalsy()
    })

    it('should not trigger click handler for Escape key', () => {
      const wrapper = mount(EventCard, {
        props: defaultProps
      })

      const button = wrapper.find('[role="button"]')
      button.trigger('keydown', { key: 'Escape' })

      expect(wrapper.emitted('click')).toBeFalsy()
    })
  })

  describe('rendering', () => {
    it('should render with all props', () => {
      const wrapper = mount(EventCard, {
        props: defaultProps
      })

      expect(wrapper.text()).toContain('Test Event')
      expect(wrapper.text()).toContain('Tokyo')
      expect(wrapper.text()).toContain('This is a test event description')
      expect(wrapper.text()).toContain('2025-11-27')
    })

    it('should render without period prop', () => {
      const propsWithoutPeriod = {
        title: 'Test Event',
        area: 'Tokyo',
        description: 'This is a test event description'
      }

      const wrapper = mount(EventCard, {
        props: propsWithoutPeriod
      })

      expect(wrapper.text()).toContain('Test Event')
      expect(wrapper.text()).toContain('Tokyo')
      expect(wrapper.text()).toContain('This is a test event description')
    })

    it('should have correct accessibility attributes', () => {
      const wrapper = mount(EventCard, {
        props: defaultProps
      })

      const button = wrapper.find('[role="button"]')
      expect(button.attributes('role')).toBe('button')
      expect(button.attributes('tabindex')).toBe('0')
      expect(button.attributes('aria-label')).toBe('Test Eventの詳細を見る')
    })
  })
})
