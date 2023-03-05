export type Topic<T> = {
  topic: T[keyof T];
  numPartitions: number;
};
export class TopicBuilder<T extends Record<string, string>> {
  private topics: Array<Array<Topic<T>>> = [];

  constructor(private readonly group: T) {}

  add(topic: keyof T, numPartitions = 10) {
    const $topic = this.group[topic].trim() as T[keyof T];
    this.topics.push([
      {
        topic: $topic,
        numPartitions,
      },
      {
        topic: `${String($topic)}.reply` as T[keyof T],
        numPartitions,
      },
    ]);

    return this;
  }

  build() {
    const topics = this.topics.flat(2);
    this.topics = [];

    return topics;
  }
}
