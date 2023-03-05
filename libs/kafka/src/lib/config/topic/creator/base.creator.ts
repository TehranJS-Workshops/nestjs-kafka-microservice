import { Kafka, logLevel } from "kafkajs";
// Utilities
import { uuid } from "../../../utils";
// Types
import type { ITopicConfig } from "kafkajs";
import type { TopicInitializerOptions } from "./type.creator";

export async function kafkaTopicInitializer(options: TopicInitializerOptions) {
  const { topics, serviceName, logger, brokers, ssl, sasl, logLevel: internalLogLevel } = options;

  const hasInfoLogLevel = internalLogLevel?.includes("info");
  const hasWarnLogLevel = internalLogLevel?.includes("warn");
  const log = (message: string) => hasInfoLogLevel && logger.log(message, "TopicInitializer");
  const warn = (message: string) => hasWarnLogLevel && logger.warn(message, "TopicInitializer");
  const topicsMap = new Map<string, ITopicConfig>();

  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];

    topicsMap.set(topic.topic, topic);
  }

  const kafka = new Kafka({
    brokers,
    ssl,
    sasl,
    logLevel: logLevel.INFO,
    clientId: `${serviceName}.${uuid()}`,
  });
  const admin = kafka.admin();

  log("Connecting to Kafka Admin...");
  await admin.connect();

  log("Connected!");
  log("Fetch lists the names of all existing topics...");

  const registeredTopics = await admin.listTopics();
  const registeredTopicsMap = new Map<string, string>();
  for (let i = 0; i < registeredTopics.length; i++) {
    const topic = registeredTopics[i];

    if (topic !== "__consumer_offsets") {
      registeredTopicsMap.set(topic, topic);
    }
  }
  log("Done");

  log("Check unique topics");
  const uniqueTopics: Array<ITopicConfig> = [];
  topicsMap.forEach((value, key) => {
    log(`Checking topic ${key} with value ${JSON.stringify(value)}`);
    if (!registeredTopicsMap.has(key)) {
      log(`Topic ${key} does not exist in Kafka`);
      uniqueTopics.push({
        ...value,
        configEntries: [
          { name: "retention.ms", value: "3000" },
          { name: "delete.retention.ms", value: "3000" }, // delete a topic after 3 seconds if it is not consumed by the consumer group for 3 seconds (default is 24 hours)
        ],
      });
    } else {
      warn(`Topic ${key} exists in Kafka`);
    }
  });
  log("Done");

  const topicsLength = uniqueTopics.length;
  const hasTopics = topicsLength > 0;
  log(hasTopics ? "Creating topics..." : "No topics to create");
  if (hasTopics) {
    const { validateOnly = false, waitForLeaders = false, timeout = 3000 } = options;
    await admin.createTopics({
      validateOnly,
      waitForLeaders,
      timeout,
      topics: uniqueTopics,
    });

    for (let i = 0; i < topicsLength; i++) {
      const topic = uniqueTopics[i];

      log(`Topic ${topic.topic} created successfully`);
    }
  }

  const topicsLen = await admin.listTopics();
  warn(`${topicsLen.length} topics is available to use and committed to Kafka`);
  log("Done, You are all set!");

  await admin.disconnect();
}
