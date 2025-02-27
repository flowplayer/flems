import './styles.js'
import m from 'mithril'
import lz from "lz-string"

import app from './app'

import Model from './model'
import { defaults, createShareLink, createHashState, circularSafeState } from './state'
import Actions from './actions'
import message from './message'
import hotkeys from './hotkeys'

let resizeRegistrered = false
window.m = m // wright hmr
function Flems(dom, state = {}, runtimeUrl) {
  const model = Model(dom, state, runtimeUrl)
      , actions = Actions(model)

  if (!resizeRegistrered) {
    window.addEventListener('resize', () => m.redraw())
    resizeRegistrered = true
  }

  message.listen(model, actions)

  // Disable hotkeys until proper combos can be decided upon
  // hotkeys(model, actions)

  m.mount(dom, {
    view: () => app(model, actions)
  })

  return {
    focus: model.focus,
    reload: () => actions.refresh({ force: true }),
    onchange: fn => actions.onchange = fn,
    onload: fn => actions.onload = fn,
    onloaded: fn => actions.onloaded = fn,
    getLink: actions.getLink,
    set: actions.setState,
    redraw: m.redraw,
    state: state,
    serialize: ()=> createHashState(state),
    exportState: ()=> circularSafeState(state)
  }
}

Flems.defaults = defaults
Flems.lz = lz
Flems.createShareLink = createShareLink
Flems.version = process.env.FLEMS_VERSION // eslint-disable-line

export default Flems

