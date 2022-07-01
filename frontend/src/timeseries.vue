<template>

</template>
<script>
export default {

  props: {
    title: {
      type: String,
      required: false
    },
    accessToken: {
      type: String,
      required: true
    },
    meteringPoint: {
      type: String,
      required: true
    },
    from: {
      type: Date,
      required: true
    },
    to: {
      type: Date,
      required: true
    },
    aggregation: {
      type: String,
      required: false,
      default: 'Year'
    }
  }
}
</script>
