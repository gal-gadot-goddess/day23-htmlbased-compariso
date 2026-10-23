// Catalog of curated technical comparisons used as guaranteed unique fallbacks
export const curatedCatalog = [
    {
        topLabel: "DATA LAKEHOUSES & FORMATS",
        mainTitle: { left: "Apache Iceberg", right: "Delta Lake", vs: "vs" },
        leftSub: "Open Table Standard",
        rightSub: "Databricks Engine",
        badge: "THE 7 CORE DIFFERENCES",
        differences: [
            {
                title: "1. METADATA SPECIFICATION",
                leftTitle: "Engine Agnostic",
                rightTitle: "Transaction Log",
                leftDesc: "Uses hierarchical snapshot tree with JSON manifests, completely independent of compute engines.",
                rightDesc: "Uses JSON commit log checkpoints with Parquet compaction, historically tailored to Apache Spark.",
                leftIcon: "Layers",
                rightIcon: "Database",
                leftVisualText: "Tree Snapshots",
                rightVisualText: "Commit Log"
            },
            {
                title: "2. PARTITION EVOLUTION",
                leftTitle: "Hidden Partitioning",
                rightTitle: "Explicit Columns",
                leftDesc: "Updates partition schemas dynamically without rewriting existing data files or breaking old queries.",
                rightDesc: "Partition changes often require migrating data or complex column-mapping configurations.",
                leftIcon: "Workflow",
                rightIcon: "ArrowRightLeft",
                leftVisualText: "Zero-Rewrite",
                rightVisualText: "Explicit Paths"
            },
            {
                title: "3. COMPUTE ECOSYSTEM",
                leftTitle: "Universal Querying",
                rightTitle: "Spark Native",
                leftDesc: "First-class citizen across Snowflake, Trino, DuckDB, ClickHouse, BigQuery, and Flink.",
                rightDesc: "Native deep optimization inside Databricks Runtime and Apache Spark clusters.",
                leftIcon: "Globe",
                rightIcon: "Server",
                leftVisualText: "Broad Vendor",
                rightVisualText: "Spark Centric"
            },
            {
                title: "4. CONCURRENCY CONTROL",
                leftTitle: "Optimistic Locking",
                rightTitle: "Catalog Protocols",
                leftDesc: "Atomic snapshot isolation via catalog commits with pluggable Nessie or REST catalogs.",
                rightDesc: "Multi-engine concurrent writes historically relied on specialized external storage locks.",
                leftIcon: "Lock",
                rightIcon: "Shield",
                leftVisualText: "Catalog Lock",
                rightVisualText: "Storage Lock"
            },
            {
                title: "5. SCHEMA EVOLUTION",
                leftTitle: "Unique Column IDs",
                rightTitle: "Name Mapping",
                leftDesc: "Tracks columns by persistent immutable integer IDs, preventing schema mismatch on renames.",
                rightDesc: "Tracks columns by name, requiring explicit column-mapping flags to rename safely.",
                leftIcon: "Code",
                rightIcon: "FileCode",
                leftVisualText: "Column IDs",
                rightVisualText: "Column Names"
            },
            {
                title: "6. TIME TRAVEL",
                leftTitle: "Snapshot Pointers",
                rightTitle: "Log Offsets",
                leftDesc: "Queries specific snapshot IDs directly with branch and tag branch capabilities.",
                rightDesc: "Replays transactional log commits back to specific timestamp or version numbers.",
                leftIcon: "FastForward",
                rightIcon: "Clock",
                leftVisualText: "Git Branches",
                rightVisualText: "Log Replay"
            },
            {
                title: "7. OPEN GOVERNANCE",
                leftTitle: "Apache 2.0 Pure",
                rightTitle: "Linux Foundation",
                leftDesc: "Neutral open-source foundation governance ensuring no single commercial company controls roadmap.",
                rightDesc: "Managed by Linux Foundation, with major feature pacing influenced by Databricks.",
                leftIcon: "Users",
                rightIcon: "Box",
                leftVisualText: "Apache Neutral",
                rightVisualText: "Vendor Led"
            }
        ]
    },
    {
        topLabel: "PYTHON RUNTIME & TOOLING",
        mainTitle: { left: "uv", right: "Poetry", vs: "vs" },
        leftSub: "Rust-Powered Speed",
        rightSub: "Standard Packaging",
        badge: "THE 7 CORE DIFFERENCES",
        differences: [
            {
                title: "1. CORE ENGINE",
                leftTitle: "Rust Binary",
                rightTitle: "Pure Python",
                leftDesc: "Written in native Rust using Tokio async I/O and zero-copy memory-mapped wheels.",
                rightDesc: "Written entirely in Python, bound by standard CPython interpreter overhead.",
                leftIcon: "Zap",
                rightIcon: "Code",
                leftVisualText: "Rust Native",
                rightVisualText: "Python Bound"
            },
            {
                title: "2. RESOLUTION SPEED",
                leftTitle: "10-100x Faster",
                rightTitle: "Traditional Pace",
                leftDesc: "Resolves complex dependency graphs in milliseconds using PubGrub algorithm in Rust.",
                rightDesc: "Dependency resolution across large packages can take dozens of seconds to minutes.",
                leftIcon: "Activity",
                rightIcon: "Clock",
                leftVisualText: "Instant Resolve",
                rightVisualText: "Slow Resolve"
            },
            {
                title: "3. PYTHON VERSION MGMT",
                leftTitle: "Built-in pyenv",
                rightTitle: "External Tooling",
                leftDesc: "Downloads, compiles, and switches standalone Python toolchains automatically out of the box.",
                rightDesc: "Requires existing local Python installation or external tools like pyenv and conda.",
                leftIcon: "Cpu",
                rightIcon: "Terminal",
                leftVisualText: "Auto Toolchains",
                rightVisualText: "Manual Setup"
            },
            {
                title: "4. WHEEL CACHING",
                leftTitle: "Hardlink & CoW",
                rightTitle: "Standard Unpack",
                leftDesc: "Uses global content-addressable cache with Copy-on-Write and filesystem hardlinks.",
                rightDesc: "Unpacks wheel files into separate virtual environment directories repeatedly.",
                leftIcon: "HardDrive",
                rightIcon: "Box",
                leftVisualText: "Hardlink Cache",
                rightVisualText: "File Copies"
            },
            {
                title: "5. LOCKFILE SPEC",
                leftTitle: "Universal uv.lock",
                rightTitle: "poetry.lock",
                leftDesc: "Cross-platform universal lockfile supporting multi-platform wheels in a single file.",
                rightDesc: "Custom poetry.lock format that requires export commands for standard pip interop.",
                leftIcon: "FileText",
                rightIcon: "Lock",
                leftVisualText: "Cross Platform",
                rightVisualText: "Poetry Format"
            },
            {
                title: "6. SCRIPT RUNNER",
                leftTitle: "Inline Dependencies",
                rightTitle: "Project Context",
                leftDesc: "Runs standalone single-file scripts with PEP 723 inline dependency metadata instantly.",
                rightDesc: "Requires creating a pyproject.toml project directory and environment to execute.",
                leftIcon: "Terminal",
                rightIcon: "Folder",
                leftVisualText: "Single Scripts",
                rightVisualText: "Project Bound"
            },
            {
                title: "7. MATURITY",
                leftTitle: "Rapid Evolution",
                rightTitle: "Battle-Tested",
                leftDesc: "Created by Astral in 2024, rapidly eating the ecosystem with blazing release cycles.",
                rightDesc: "Decade-long industry staple with massive enterprise adoption and extensive plugins.",
                leftIcon: "Flame",
                rightIcon: "Shield",
                leftVisualText: "Modern Disruptor",
                rightVisualText: "Legacy Standard"
            }
        ]
    },
    {
        topLabel: "EDGE WEB FRAMEWORKS",
        mainTitle: { left: "Elysia", right: "Hono", vs: "vs" },
        leftSub: "Bun Optimized",
        rightSub: "Universal Edge",
        badge: "THE 7 CORE DIFFERENCES",
        differences: [
            {
                title: "1. TARGET RUNTIME",
                leftTitle: "Bun Native",
                rightTitle: "Multi-Runtime",
                leftDesc: "Engineered specifically for Bun runtime, leveraging Bun's internal C++ APIs for max speed.",
                rightDesc: "Runs universally on Cloudflare Workers, Deno, Node.js, Bun, Fastly, and AWS Lambda.",
                leftIcon: "Cpu",
                rightIcon: "Globe",
                leftVisualText: "Bun Optimized",
                rightVisualText: "Universal Multi"
            },
            {
                title: "2. TYPE INFERENCE",
                leftTitle: "TypeBox Schema",
                rightTitle: "TypeScript Generics",
                leftDesc: "Uses TypeBox for compile-time and runtime validation with ultra-deep type inference.",
                rightDesc: "Uses lightweight TypeScript type inference with optional Zod and Valibot validators.",
                leftIcon: "Code",
                rightIcon: "FileCode",
                leftVisualText: "TypeBox Core",
                rightVisualText: "Generic Types"
            },
            {
                title: "3. ROUTER ARCHITECTURE",
                leftTitle: "Dynamic JIT",
                rightTitle: "RegExp Router",
                leftDesc: "Compiles route handlers into optimized JavaScript functions using JIT techniques at startup.",
                rightDesc: "Uses SmartRouter with Trie and unified RegExp routing for near-instant path resolution.",
                leftIcon: "Zap",
                rightIcon: "Compass",
                leftVisualText: "JIT Compiled",
                rightVisualText: "RegExp Trie"
            },
            {
                title: "4. RPC CLIENT",
                leftTitle: "Eden Treaty",
                rightTitle: "Hono Client",
                leftDesc: "Eden treaty shares full backend types directly with frontend clients without code generation.",
                rightDesc: "hc (Hono Client) exposes chainable typed fetch calls mirroring backend route structures.",
                leftIcon: "Network",
                rightIcon: "ArrowRightLeft",
                leftVisualText: "Eden RPC",
                rightVisualText: "hc Typed"
            },
            {
                title: "5. BUNDLE OVERHEAD",
                leftTitle: "Feature Rich",
                rightTitle: "Sub-15kB Zero Deps",
                leftDesc: "Includes schema compilation and parsing helpers with slightly larger base footprint.",
                rightDesc: "Ultra-lean zero-dependency footprint designed for sub-millisecond cold starts on edge workers.",
                leftIcon: "Box",
                rightIcon: "Activity",
                leftVisualText: "Full Toolkit",
                rightVisualText: "Ultra Lean"
            },
            {
                title: "6. MIDDLEWARE PATTERN",
                leftTitle: "Lifecycle Hooks",
                rightTitle: "Onion Model",
                leftDesc: "Structured lifecycle events (onRequest, onBeforeHandle, onAfterHandle, onError).",
                rightDesc: "Classic await next() onion middleware model familiar to Koa and Express developers.",
                leftIcon: "Layers",
                rightIcon: "Workflow",
                leftVisualText: "Event Hooks",
                rightVisualText: "Next() Onion"
            },
            {
                title: "7. PRIMARY USE-CASE",
                leftTitle: "Bun Microservices",
                rightTitle: "Cloudflare Edge",
                leftDesc: "Ideal for high-throughput Bun backend APIs, real-time WebSockets, and internal services.",
                rightDesc: "The undisputed default choice for Cloudflare Workers, serverless edge APIs, and webhooks.",
                leftIcon: "Server",
                rightIcon: "Cloud",
                leftVisualText: "Bun Backends",
                rightVisualText: "Cloudflare Edge"
            }
        ]
    },
    {
        topLabel: "IN-MEMORY DATA STORES",
        mainTitle: { left: "Dragonfly", right: "Redis", vs: "vs" },
        leftSub: "Multi-Threaded Core",
        rightSub: "Single-Threaded King",
        badge: "THE 7 CORE DIFFERENCES",
        differences: [
            {
                title: "1. THREADING MODEL",
                leftTitle: "Shared-Nothing Threads",
                rightTitle: "Single Event Loop",
                leftDesc: "Uses fiber-based shared-nothing multi-threading to scale across dozens of CPU cores on one box.",
                rightDesc: "Executes commands sequentially on a single thread to guarantee deterministic order without mutexes.",
                leftIcon: "Cpu",
                rightIcon: "Activity",
                leftVisualText: "Multi-Core SIMD",
                rightVisualText: "Single Thread"
            },
            {
                title: "2. HARDWARE SCALING",
                leftTitle: "Vertical Mastery",
                rightTitle: "Horizontal Clusters",
                leftDesc: "Delivers millions of QPS on a single modern server without running multi-node cluster proxies.",
                rightDesc: "Requires Redis Cluster with master-replica sharding to utilize multi-core server hardware.",
                leftIcon: "Server",
                rightIcon: "Layers",
                leftVisualText: "Single Box Scale",
                rightVisualText: "Cluster Shards"
            },
            {
                title: "3. MEMORY EFFICIENCY",
                leftTitle: "DASHT Hash Tables",
                rightTitle: "Dict Chaining",
                leftDesc: "Custom memory allocator and dynamic hash tables reduce memory overhead by up to 30%.",
                rightDesc: "Uses jemalloc with standard linked dict chaining, experiencing higher memory fragmentation.",
                leftIcon: "HardDrive",
                rightIcon: "Database",
                leftVisualText: "Compact DASHT",
                rightVisualText: "Linked Dicts"
            },
            {
                title: "4. SNAPSHOTTING",
                leftTitle: "Zero Fork BGSAVE",
                rightTitle: "Linux Fork Mechanism",
                leftDesc: "Takes point-in-time snapshots without Linux fork(), avoiding double memory allocation crashes.",
                rightDesc: "Uses copy-on-write fork(), risking out-of-memory errors during heavy write snapshots.",
                leftIcon: "Shield",
                rightIcon: "Zap",
                leftVisualText: "Forkless Save",
                rightVisualText: "Fork CoW"
            },
            {
                title: "5. PROTOCOL COMPATIBILITY",
                leftTitle: "Drop-in Redis API",
                rightTitle: "Original Source",
                leftDesc: "Compatible with existing Redis client libraries, strings, hashes, sets, and pub/sub commands.",
                rightDesc: "Defines the standard RESP protocol and ecosystem reference implementation.",
                leftIcon: "ArrowRightLeft",
                rightIcon: "Terminal",
                leftVisualText: "Redis API Clone",
                rightVisualText: "RESP Creator"
            },
            {
                title: "6. ECOSYSTEM EXTENSIONS",
                leftTitle: "Core Features",
                rightTitle: "Rich Modules",
                leftDesc: "Focuses on speed and caching core with select search and JSON extensions built in.",
                rightDesc: "Massive ecosystem of C modules including RediSearch, RedisJSON, and RedisTimeSeries.",
                leftIcon: "Box",
                rightIcon: "Layers",
                leftVisualText: "Built-in Core",
                rightVisualText: "Modular Suite"
            },
            {
                title: "7. LICENSE & GOVERNANCE",
                leftTitle: "BSL / Commercial",
                rightTitle: "RSALv2 / SSPL",
                leftDesc: "Licensed under Business Source License (BSL), transitioning to open source after fixed years.",
                rightDesc: "Relicensed away from BSD to RSALv2/SSPL, sparking the open-source Valkey fork.",
                leftIcon: "FileText",
                rightIcon: "Key",
                leftVisualText: "BSL License",
                rightVisualText: "Dual Source"
            }
        ]
    },
    {
        topLabel: "VECTOR DATABASES & SEARCH",
        mainTitle: { left: "Milvus", right: "Weaviate", vs: "vs" },
        leftSub: "Cloud-Native Scale",
        rightSub: "Modular Knowledge",
        badge: "THE 7 CORE DIFFERENCES",
        differences: [
            {
                title: "1. ARCHITECTURE",
                leftTitle: "Disaggregated Microservices",
                rightTitle: "Modular Monolith",
                leftDesc: "Separates storage, query nodes, index nodes, and coordinator nodes on top of Kafka and MinIO.",
                rightDesc: "Single cohesive binary written in Go with pluggable module extensions for vectorizers.",
                leftIcon: "Layers",
                rightIcon: "Box",
                leftVisualText: "Distributed Nodes",
                rightVisualText: "Cohesive Go App"
            },
            {
                title: "2. VECTOR INDEXING",
                leftTitle: "Knowhere Core",
                rightTitle: "HNSW Native",
                leftDesc: "Uses Knowhere C++ engine supporting HNSW, IVF-Flat, SCaNN, and GPU-accelerated indexes.",
                rightDesc: "Custom HNSW index with dynamic quantization and flat filtering directly in memory.",
                leftIcon: "Cpu",
                rightIcon: "Zap",
                leftVisualText: "Multi-Index / GPU",
                rightVisualText: "In-Memory HNSW"
            },
            {
                title: "3. HYBRID SEARCH",
                leftTitle: "Dense & Sparse Vectors",
                rightTitle: "BM25 + Dense Hybrid",
                leftDesc: "Combines dense embeddings with sparse lexical vectors using Rank Fusion algorithms.",
                rightDesc: "Built-in inverted index for keyword BM25 search fused directly with vector similarity.",
                leftIcon: "Activity",
                rightIcon: "Compass",
                leftVisualText: "Vector Fusion",
                rightVisualText: "Native BM25"
            },
            {
                title: "4. EMBEDDINGS PIPELINE",
                leftTitle: "External Generation",
                rightTitle: "Integrated Modules",
                leftDesc: "Client application generates and pushes vectors; database focuses strictly on indexing.",
                rightDesc: "Connects directly to OpenAI, Cohere, and HuggingFace to auto-vectorize incoming text.",
                leftIcon: "Terminal",
                rightIcon: "Workflow",
                leftVisualText: "Bring Your Own",
                rightVisualText: "Auto Embeddings"
            },
            {
                title: "5. DATA MODEL",
                leftTitle: "Relational Collections",
                rightTitle: "GraphQL Objects",
                leftDesc: "Defines strict schemas with scalar columns, dynamic JSON fields, and vector arrays.",
                rightDesc: "Object-oriented class structures queryable via GraphQL syntax and REST endpoints.",
                leftIcon: "Database",
                rightIcon: "Code",
                leftVisualText: "Schema Tables",
                rightVisualText: "GraphQL Classes"
            },
            {
                title: "6. MAXIMUM SCALE",
                leftTitle: "Tens of Billions",
                rightTitle: "Hundreds of Millions",
                leftDesc: "Architected for massive enterprise billion-scale workloads across large Kubernetes clusters.",
                rightDesc: "Excels at low-to-medium latency multi-modal applications with simple operational footprint.",
                leftIcon: "Server",
                rightIcon: "HardDrive",
                leftVisualText: "Billion Scale",
                rightVisualText: "Agile Scale"
            },
            {
                title: "7. OPERATIONAL COMPLEXITY",
                leftTitle: "High K8s Overhead",
                rightTitle: "Simple Container",
                leftDesc: "Requires etcd, Pulsar/Kafka, and object storage like S3 for production deployments.",
                rightDesc: "Runs smoothly inside single docker-compose files with minimal administrative overhead.",
                leftIcon: "Shield",
                rightIcon: "FastForward",
                leftVisualText: "High Infra Setup",
                rightVisualText: "Instant Docker"
            }
        ]
    },
    {
        topLabel: "TOKEN SECURITY & AUTH",
        mainTitle: { left: "PASETO", right: "JWT", vs: "vs" },
        leftSub: "Secure by Design",
        rightSub: "Universal Standard",
        badge: "THE 7 CORE DIFFERENCES",
        differences: [
            {
                title: "1. CIPHER NEGOTIATION",
                leftTitle: "Zero Algorithm Agility",
                rightTitle: "Dynamic 'alg' Header",
                leftDesc: "Versioned suites lock exact ciphers, completely preventing 'none' algorithm and downgrade attacks.",
                rightDesc: "Decoupled header specifies signing algorithm dynamically, historically leading to critical exploit vulnerabilities.",
                leftIcon: "Shield",
                rightIcon: "AlertTriangle",
                leftVisualText: "Locked Ciphers",
                rightVisualText: "Alg Header Risk"
            },
            {
                title: "2. ENCRYPTION SUPPORT",
                leftTitle: "Native AEAD",
                rightTitle: "JWE Complexity",
                leftDesc: "Encrypted tokens (v4.local) use ChaCha20-Poly1305 with built-in authenticated encryption simply.",
                rightDesc: "Requires complex JSON Web Encryption (JWE) specification with confusing key wrapping options.",
                leftIcon: "Lock",
                rightIcon: "Key",
                leftVisualText: "Simple Local",
                rightVisualText: "Complex JWE"
            },
            {
                title: "3. CRYPTO PRIMITIVES",
                leftTitle: "Modern Curves",
                rightTitle: "Legacy Options",
                leftDesc: "Mandates Ed25519 for asymmetric signing and XChaCha20 for symmetric encryption.",
                rightDesc: "Supports older vulnerable modes including RSA PKCS#1 v1.5 and variable HMAC lengths.",
                leftIcon: "Zap",
                rightIcon: "Layers",
                leftVisualText: "Ed25519 Modern",
                rightVisualText: "RSA / HMAC Legacy"
            },
            {
                title: "4. PARSING FOOTPRINT",
                leftTitle: "Clean Footer & Body",
                rightTitle: "3 Base64 Segments",
                leftDesc: "Format is strictly version.purpose.payload(.footer), parsed deterministically without header ambiguity.",
                rightDesc: "Format is header.payload.signature, requiring base64 decode of header before key validation.",
                leftIcon: "Code",
                rightIcon: "FileText",
                leftVisualText: "Strict Format",
                rightVisualText: "Header First"
            },
            {
                title: "5. ECOSYSTEM ADOPTION",
                leftTitle: "Modern Security Pick",
                rightTitle: "Universal Standard",
                leftDesc: "Favored by modern security engineers and cryptographic purists for greenfield architectures.",
                rightDesc: "Used universally by Auth0, Firebase, AWS Cognito, Okta, and OpenID Connect specifications.",
                leftIcon: "Activity",
                rightIcon: "Globe",
                leftVisualText: "Security First",
                rightVisualText: "Everywhere"
            },
            {
                title: "6. FOOTER METADATA",
                leftTitle: "Unencrypted Footer",
                rightTitle: "Unprotected Headers",
                leftDesc: "Supports unencrypted public footers for key ID routing authenticated by the signature.",
                rightDesc: "Encodes kid directly inside JWT header, often trusting unverified user-supplied input.",
                leftIcon: "Compass",
                rightIcon: "Folder",
                leftVisualText: "Signed Footer",
                rightVisualText: "Header kid"
            },
            {
                title: "7. FOOTGUN RESISTANCE",
                leftTitle: "Impenetrable Defaults",
                rightTitle: "Requires Hardening",
                leftDesc: "Developers cannot choose weak keys or broken algorithms; the library enforces strong cryptography.",
                rightDesc: "Developers must manually enforce algorithm whitelisting and verify secret key strength.",
                leftIcon: "CheckCircle",
                rightIcon: "Box",
                leftVisualText: "Foolproof",
                rightVisualText: "Careful Setup"
            }
        ]
    },
    {
        topLabel: "TYPESCRIPT DATABASE TOOLS",
        mainTitle: { left: "Prisma", right: "Drizzle ORM", vs: "vs" },
        leftSub: "Schema First",
        rightSub: "SQL First",
        badge: "THE 7 CORE DIFFERENCES",
        differences: [
            {
                title: "1. SCHEMA DEFINITION",
                leftTitle: "Custom DSL (.prisma)",
                rightTitle: "Pure TypeScript",
                leftDesc: "Writes models in custom schema.prisma file and runs code generators to produce client types.",
                rightDesc: "Defines tables and relations directly using plain TypeScript objects without code generation.",
                leftIcon: "FileCode",
                rightIcon: "Code",
                leftVisualText: "Prisma DSL",
                rightVisualText: "Pure TypeScript"
            },
            {
                title: "2. ENGINE ARCHITECTURE",
                leftTitle: "Rust Query Engine",
                rightTitle: "Zero-Overhead JS",
                leftDesc: "Compiles queries through an internal Rust binary/WASM engine communicating over IPC.",
                rightDesc: "Lightweight pure JavaScript query builder compiling directly into SQL strings with zero engine overhead.",
                leftIcon: "Server",
                rightIcon: "Zap",
                leftVisualText: "Rust Binary",
                rightVisualText: "Zero Overhead"
            },
            {
                title: "3. COLD START LATENCY",
                leftTitle: "Heavy on Serverless",
                rightTitle: "Sub-Millisecond",
                leftDesc: "Engine initialization causes noticeable latency spikes on AWS Lambda and Vercel Functions.",
                rightDesc: "Instantaneous execution with minimal memory footprint, ideal for edge and serverless environments.",
                leftIcon: "Clock",
                rightIcon: "Activity",
                leftVisualText: "Cold Start Lag",
                rightVisualText: "Instant Edge"
            },
            {
                title: "4. QUERY MENTAL MODEL",
                leftTitle: "Nested Graph Objects",
                rightTitle: "SQL Parity",
                leftDesc: "Uses object-graph notation (findMany, include, select) abstracting away underlying SQL joins.",
                rightDesc: "Mirrors SQL syntax closely (select, from, leftJoin) giving full transparency of executed queries.",
                leftIcon: "Layers",
                rightIcon: "Database",
                leftVisualText: "Object Graph",
                rightVisualText: "Direct SQL"
            },
            {
                title: "5. MIGRATIONS",
                leftTitle: "Automated Shadow DB",
                rightTitle: "SQL Diffs via Kit",
                leftDesc: "Uses a temporary shadow database to calculate schema diffs and apply automated migrations.",
                rightDesc: "Drizzle Kit inspects TypeScript files and generates clean plain SQL migration files.",
                leftIcon: "Workflow",
                rightIcon: "Terminal",
                leftVisualText: "Shadow Database",
                rightVisualText: "Plain SQL Diffs"
            },
            {
                title: "6. ECOSYSTEM & PLUGINS",
                leftTitle: "Prisma Studio & Gen",
                rightTitle: "Drizzle Studio",
                leftDesc: "Mature ecosystem with Prisma Studio GUI, extensive validation plugins, and nestable seeding.",
                rightDesc: "Modern lightweight Drizzle Studio with rapid feature additions and serverless driver support.",
                leftIcon: "Box",
                rightIcon: "Compass",
                leftVisualText: "Rich Tooling",
                rightVisualText: "Modern Studio"
            },
            {
                title: "7. DEVELOPER EXPERIENCE",
                leftTitle: "High-Level Simplicity",
                rightTitle: "Total SQL Control",
                leftDesc: "Loved by developers who dislike SQL and want intuitive nested relational data fetching.",
                rightDesc: "Preferred by performance purists who demand full control over indexes, joins, and raw queries.",
                leftIcon: "Heart",
                rightIcon: "Shield",
                leftVisualText: "Intuitive DX",
                rightVisualText: "Precision Control"
            }
        ]
    },
    {
        topLabel: "WORKFLOW ORCHESTRATION",
        mainTitle: { left: "Temporal", right: "Apache Airflow", vs: "vs" },
        leftSub: "Durable Execution",
        rightSub: "Batch Data DAGs",
        badge: "THE 7 CORE DIFFERENCES",
        differences: [
            {
                title: "1. CORE PARADIGM",
                leftTitle: "Durable State Code",
                rightTitle: "Static Graph DAGs",
                leftDesc: "Writes standard imperative code (loops, async/await); server preserves execution state across crashes.",
                rightDesc: "Defines directed acyclic graphs (DAGs) of discrete tasks executed by scheduled worker processes.",
                leftIcon: "Code",
                rightIcon: "Workflow",
                leftVisualText: "Code As State",
                rightVisualText: "Scheduled DAGs"
            },
            {
                title: "2. EXECUTION LATENCY",
                leftTitle: "Millisecond Events",
                rightTitle: "Minutes Batching",
                leftDesc: "Responds to user events, timers, and signals with sub-second event-driven responsiveness.",
                rightDesc: "Built for scheduled batch data pipelines running hourly or daily with scheduling delays.",
                leftIcon: "Zap",
                rightIcon: "Clock",
                leftVisualText: "Event-Driven",
                rightVisualText: "Batch Schedule"
            },
            {
                title: "3. TARGET USE CASE",
                leftTitle: "Business Logic",
                rightTitle: "Data Engineering",
                leftDesc: "Order fulfillment, financial transfers, subscription lifecycles, and microservice sagas.",
                rightDesc: "ETL pipelines, data warehouse refreshes, machine learning model training, and SQL batching.",
                leftIcon: "Activity",
                rightIcon: "Database",
                leftVisualText: "Business Sagas",
                rightVisualText: "Data ETL"
            },
            {
                title: "4. EVENT REPLAY",
                leftTitle: "Deterministic Replay",
                rightTitle: "Task Retries",
                leftDesc: "Rebuilds local execution memory by replaying historical event history automatically upon recovery.",
                rightDesc: "Reruns entire failed task nodes within the graph using configured retry policies.",
                leftIcon: "FastForward",
                rightIcon: "RotateCcw",
                leftVisualText: "State Recovery",
                rightVisualText: "Task Rerun"
            },
            {
                title: "5. LANGUAGE SUPPORT",
                leftTitle: "Multi-Language SDKs",
                rightTitle: "Python Exclusive",
                leftDesc: "Native SDKs for Go, TypeScript, Python, Java, and .NET running across distributed workers.",
                rightDesc: "Authoring pipelines is strictly done in Python using Airflow operators and hooks.",
                leftIcon: "Globe",
                rightIcon: "FileCode",
                leftVisualText: "Polyglot SDKs",
                rightVisualText: "Python Centric"
            },
            {
                title: "6. HUMAN IN THE LOOP",
                leftTitle: "Months-Long Sleep",
                rightTitle: "Sensor Polling",
                leftDesc: "Workflows can sleep for months or wait for external webhook signals with zero resource cost.",
                rightDesc: "Requires active worker sensors or poking intervals that consume polling queue resources.",
                leftIcon: "Clock",
                rightIcon: "Server",
                leftVisualText: "Infinite Sleep",
                rightVisualText: "Sensor Polling"
            },
            {
                title: "7. INFRASTRUCTURE",
                leftTitle: "Clustered Service",
                rightTitle: "Webserver & Celery",
                leftDesc: "Temporal Server with persistence layer (Cassandra/Postgres) manages event queues and routing.",
                rightDesc: "Requires scheduler daemon, webserver UI, metadata database, and Celery/Kubernetes workers.",
                leftIcon: "Layers",
                rightIcon: "Box",
                leftVisualText: "Temporal Core",
                rightVisualText: "Multi-Process"
            }
        ]
    },
    {
        topLabel: "DESKTOP APPLICATION FRAMEWORKS",
        mainTitle: { left: "Tauri", right: "Electron", vs: "vs" },
        leftSub: "Rust & Native Webview",
        rightSub: "Node.js & Chromium",
        badge: "THE 7 CORE DIFFERENCES",
        differences: [
            {
                title: "1. BUNDLE SIZE",
                leftTitle: "~3-10 MB",
                rightTitle: "~80-150 MB",
                leftDesc: "Leverages the operating system's native webview (WebKit/WebView2), drastically cutting binary size.",
                rightDesc: "Bundles a complete copy of Chromium and Node.js with every single application package.",
                leftIcon: "HardDrive",
                rightIcon: "Box",
                leftVisualText: "Tiny Binary",
                rightVisualText: "Heavy Chromium"
            },
            {
                title: "2. MEMORY FOOTPRINT",
                leftTitle: "~30-60 MB RAM",
                rightTitle: "~150-500 MB RAM",
                leftDesc: "Lean Rust backend with zero V8 interpreter engine running behind the native window.",
                rightDesc: "Multi-process architecture running full Chromium browser tabs and Node V8 engine in RAM.",
                leftIcon: "Activity",
                rightIcon: "Cpu",
                leftVisualText: "Low RAM",
                rightVisualText: "High RAM"
            },
            {
                title: "3. BACKEND LANGUAGE",
                leftTitle: "Rust Core",
                rightTitle: "JavaScript / Node",
                leftDesc: "High-performance memory-safe native Rust code handling system APIs, threads, and files.",
                rightDesc: "Node.js runtime providing familiar JavaScript/TypeScript access to operating system APIs.",
                leftIcon: "Shield",
                rightIcon: "Code",
                leftVisualText: "Rust Native",
                rightVisualText: "Node JS"
            },
            {
                title: "4. SECURITY SANDBOXING",
                leftTitle: "Granular Scopes",
                rightTitle: "Node Integration",
                leftDesc: "Enforces strict compile-time permission scopes for filesystem, shell, and network access.",
                rightDesc: "Full Node.js API integration inside window contexts has historically required careful isolation.",
                leftIcon: "Lock",
                rightIcon: "AlertTriangle",
                leftVisualText: "Strict Isolation",
                rightVisualText: "Context Isolation"
            },
            {
                title: "5. BROWSER CONSISTENCY",
                leftTitle: "OS Webview Matrix",
                rightTitle: "Identical Chromium",
                leftDesc: "Renders via WebView2 on Windows, WebKit on macOS, and WebKitGTK on Linux with minor quirks.",
                rightDesc: "Identical pixel-perfect rendering across all operating systems powered by pinned Chromium.",
                leftIcon: "Globe",
                rightIcon: "Compass",
                leftVisualText: "System Webview",
                rightVisualText: "Uniform Engine"
            },
            {
                title: "6. MOBILE COMPILATION",
                leftTitle: "iOS & Android",
                rightTitle: "Desktop Only",
                leftDesc: "Tauri v2 compiles natively to iOS and Android mobile apps from the same core codebase.",
                rightDesc: "Strictly targeted at desktop platforms (Windows, macOS, Linux) without mobile support.",
                leftIcon: "Smartphone",
                rightIcon: "Server",
                leftVisualText: "Mobile + Desktop",
                rightVisualText: "Desktop Pure"
            },
            {
                title: "7. ECOSYSTEM MATURITY",
                leftTitle: "Modern Challenger",
                rightTitle: "Industry Standard",
                leftDesc: "Rapidly growing community with modern tooling, plugins, and surging developer excitement.",
                rightDesc: "Powers giants like VS Code, Slack, Discord, and Figma with deep battle-tested stability.",
                leftIcon: "Flame",
                rightIcon: "CheckCircle",
                leftVisualText: "Rising Star",
                rightVisualText: "Enterprise King"
            }
        ]
    },
    {
        topLabel: "MODERN WEB SERVERS",
        mainTitle: { left: "Caddy", right: "NGINX", vs: "vs" },
        leftSub: "Automatic HTTPS",
        rightSub: "High-Concurrency King",
        badge: "THE 7 CORE DIFFERENCES",
        differences: [
            {
                title: "1. TLS / SSL AUTOMATION",
                leftTitle: "Zero-Config HTTPS",
                rightTitle: "Certbot Manual Setup",
                leftDesc: "Obtains, renews, and manages Let's Encrypt TLS certificates automatically by default.",
                rightDesc: "Requires external Certbot cron jobs or ACME clients to configure and renew certificates.",
                leftIcon: "Lock",
                rightIcon: "Settings",
                leftVisualText: "Auto TLS",
                rightVisualText: "Certbot Script"
            },
            {
                title: "2. CONFIGURATION DX",
                leftTitle: "Simple Caddyfile",
                rightTitle: "Complex Directives",
                leftDesc: "Intuitive, clean human-friendly syntax with dynamic JSON API reconfiguration on the fly.",
                rightDesc: "Dense declarative block syntax with legacy caveats like 'if is evil' inside location blocks.",
                leftIcon: "FileText",
                rightIcon: "FileCode",
                leftVisualText: "Clean Caddyfile",
                rightVisualText: "Dense Directives"
            },
            {
                title: "3. UNDERLYING LANGUAGE",
                leftTitle: "Memory-Safe Go",
                rightTitle: "C Optimization",
                leftDesc: "Written entirely in Go, immune to memory corruption, buffer overflows, and segmentation faults.",
                rightDesc: "Written in highly tuned C, maximizing raw compute efficiency and low-level socket operations.",
                leftIcon: "Shield",
                rightIcon: "Cpu",
                leftVisualText: "Go Safe",
                rightVisualText: "Raw C Speed"
            },
            {
                title: "4. DYNAMIC API CONFIG",
                leftTitle: "Native REST API",
                rightTitle: "Signal Reloads",
                leftDesc: "Mutate running reverse proxy configurations dynamically via JSON REST endpoints without drops.",
                rightDesc: "Requires editing static text configuration files and issuing nginx -s reload signals.",
                leftIcon: "Network",
                rightIcon: "Terminal",
                leftVisualText: "Live REST API",
                rightVisualText: "SIGHUP Reload"
            },
            {
                title: "5. MODERN PROTOCOLS",
                leftTitle: "HTTP/3 & QUIC Out of Box",
                rightTitle: "Requires Modules",
                leftDesc: "Enabled HTTP/3 and QUIC protocol support natively years before other standard servers.",
                rightDesc: "HTTP/3 support was gradually finalized and requires specific compiled module flags.",
                leftIcon: "Zap",
                rightIcon: "Globe",
                leftVisualText: "Default QUIC",
                rightVisualText: "Compiled Flags"
            },
            {
                title: "6. PEAK CONCURRENCY",
                leftTitle: "Excellent Goroutines",
                rightTitle: "Extreme C Mastery",
                leftDesc: "Handles hundreds of thousands of concurrent connections smoothly via Go's runtime scheduler.",
                rightDesc: "The undisputed global master of raw connections per megabyte at massive hyperscale.",
                leftIcon: "Activity",
                rightIcon: "Layers",
                leftVisualText: "Goroutines",
                rightVisualText: "Event epoll"
            },
            {
                title: "7. ADOPTION SCALE",
                leftTitle: "Developer Favorite",
                rightTitle: "1/3 of the Web",
                leftDesc: "Massively popular for modern web development, microservices, and hassle-free deployments.",
                rightDesc: "Powers more than 30% of top-million internet sites and high-traffic content distribution networks.",
                leftIcon: "Heart",
                rightIcon: "Server",
                leftVisualText: "Modern DX",
                rightVisualText: "Web Backbone"
            }
        ]
    }
];
