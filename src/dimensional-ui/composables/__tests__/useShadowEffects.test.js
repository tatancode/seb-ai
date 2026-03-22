import { describe, it, expect } from 'vitest'

describe('useShadowEffects', () => {
  it('should be importable', async () => {
    const { useShadowEffects } = await import('../useShadowEffects.js')
    expect(useShadowEffects).toBeDefined()
    expect(typeof useShadowEffects).toBe('function')
  })

  it('should handle basic shadow logic', async () => {
    const { useShadowEffects } = await import('../useShadowEffects.js')
    const shadowEffects = useShadowEffects()

    // Test pressed state returns none (this logic doesn't depend on DOM)
    const pressedShadow = shadowEffects.getDynamicShadow('md', { isPressed: true })
    expect(pressedShadow).toBe('none')

    // Test shadow class generation
    const pressedClass = shadowEffects.getShadowClass('md', { isPressed: true })
    expect(pressedClass).toBe('d-shadow-none')

    // Test shadow offset (static data)
    const offset = shadowEffects.getShadowOffset('md')
    expect(offset).toEqual({ x: 3, y: 3 })

    // Test API structure
    expect(shadowEffects.currentShadowSize).toBeDefined()
    expect(shadowEffects.getDynamicShadow).toBeDefined()
    expect(shadowEffects.getShadowClass).toBeDefined()
    expect(shadowEffects.getShadowStyles).toBeDefined()
    expect(shadowEffects.createStickerEffects).toBeDefined()
  })
})