<template>
  <span :title="exactDate()">{{ diffTime() }}</span>
</template>

<script>
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedDate from "dayjs/plugin/localizedFormat";

dayjs.extend(relativeTime);
dayjs.extend(localizedDate);

export default {
  props: {
    timeStamp: {
      required: true,
      type: Number,
    },
  },
  // composition api
  setup(props) {
    // methods
    const diffTime = () => dayjs.unix(props.timeStamp).fromNow();
    const exactDate = () => dayjs.unix(props.timeStamp).format("llll");

    return { diffTime, exactDate };
  },
};
</script>

<style></style>
