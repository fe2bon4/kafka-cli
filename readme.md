# Kafka CLI

An Apache Kafka command-line-interface built with commander,kafkajs and xstate.

## Installation

```sh
npm install -g @fe2bon4/kafka-cli
```

## Usage

### Main

kafka-cli [options] [command]

- Usage: kafka-cli [options] [command]

- Options:

  - **h, --help**, display help for command

Commands:

- **admin**, [options] Kafka Admin Client
- **producer**, [options] Kafka Producer Client
- **consumer**, [options] Kafka Consumer Client
- **help**, [command] display help for command

### Admin

Kafka Admin Client

- Usage: kafka-cli admin [options]
- Options:
  - **i, --id &lt;id&gt;**, Kafka Consumer Id
  - **b, --brokers &lt;brokers&gt;**, Comma-delimited list of kafka brokers (e.g. kafka-1:9092,kakfa-2:9092)
  - **h, --help** display help for command

### Producer

Kafka Producer Client

- Usage: kafka-cli producer [options]

- Options:
  - **i, --id &lt;id&gt;**, Kafka Consumer Id
  - **b, --brokers &lt;brokers&gt;**, Comma-delimited list of kafka brokers (e.g. kafka-1:9092,kakfa-2:9092)
  - **t, --topic &lt;topic&gt;**, Kafka topic to produce into.
  - **h, --help**, display help for command

### Consumer

Kafka Consumer Client

- Usage: kafka-cli consumer [options]

- Options:
  - **i, --id &lt;id&gt;**, Kafka Consumer Id
  - **g, --group &lt;group&gt;**, Kafka Consumer Group
  - **b, --brokers &lt;brokers&gt;**, Comma-delimited list of kafka brokers (e.g. kafka-1:9092,kakfa-2:9092)
  - **t, --topic &lt;topic&gt;**, Kafka topic to consume from
  - **h, --help**, display help for command
