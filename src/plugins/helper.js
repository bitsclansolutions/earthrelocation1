import Vue from 'vue'

Vue.mixin({
  methods: {
    inpValidate: (refs) => {
      for (var f in refs) {
        if (Array.isArray(refs[f])) {
          for (var indf in refs[f]) {
            if (typeof refs[f] === 'object' && !refs[f][indf].validate(true)) return false
          }
        } else {
          if (typeof refs[f] === 'object' && typeof refs[f].validate === 'function' && !refs[f].validate(true)) return false
        }
      }
      return true
    },
  },
})
