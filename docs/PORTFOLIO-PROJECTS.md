# Portfolio Projects — Implementation Guide

## Overview

Five projects designed to cover every skill and technology listed on the Hello Fahid portfolio site. Each project builds on the previous one, progressively increasing in scope. All projects will be deployed and linked from the portfolio.

---

## Project 1: DevOps Pipeline Dashboard

### Goal
A self-hosted web dashboard that displays real-time CI/CD pipeline status, build history, deployment logs, and failure analytics. Think of it as a lightweight Datadog/Jenkins Blue Ocean alternative you built yourself.

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Backend | Python (FastAPI) | REST API, webhook receiver, business logic |
| Database | MongoDB | Store build records, deployment logs, metrics |
| Frontend | Vanilla JS + Chart.js | Dashboard UI, real-time charts |
| Containerization | Docker + Docker Compose | Package and run all services |
| CI/CD | Jenkins | Trigger builds, send webhook events to the dashboard |
| Monitoring | Grafana (optional) | Additional metric visualization |
| Version Control | Git / GitHub | Source control, GitHub Actions for the dashboard's own CI |

### Architecture

```
GitHub Repo Push
       │
       ▼
   Jenkins Job ──webhook──▶ FastAPI Backend ──▶ MongoDB
                                   │
                                   ▼
                           Dashboard Frontend
                         (build status, charts,
                          deployment history)
```

### Implementation Plan

#### Phase 1: Backend API (Week 1)
- Set up FastAPI project with proper folder structure:
  ```
  devops-dashboard/
  ├── app/
  │   ├── main.py            # FastAPI app, CORS, startup
  │   ├── routes/
  │   │   ├── builds.py      # GET /builds, GET /builds/{id}
  │   │   ├── webhooks.py    # POST /webhook/jenkins
  │   │   └── metrics.py     # GET /metrics/summary
  │   ├── models/
  │   │   └── build.py       # Pydantic models for build records
  │   ├── db/
  │   │   └── mongo.py       # MongoDB connection, CRUD operations
  │   └── config.py          # Environment variables, settings
  ├── tests/
  │   ├── test_builds.py
  │   └── test_webhooks.py
  ├── Dockerfile
  ├── docker-compose.yml
  ├── requirements.txt
  └── README.md
  ```
- Implement endpoints:
  - `POST /webhook/jenkins` — receives Jenkins build notifications, stores in MongoDB
  - `GET /api/builds` — list all builds with pagination, filtering by status/project
  - `GET /api/builds/{id}` — single build detail with full logs
  - `GET /api/metrics/summary` — aggregated stats (success rate, avg build time, failure count)
- MongoDB schema for builds:
  ```json
  {
    "project": "iot-platform",
    "branch": "main",
    "status": "success|failure|running",
    "build_number": 142,
    "duration_seconds": 87,
    "triggered_by": "push",
    "commit_sha": "abc123",
    "started_at": "2026-03-20T10:30:00Z",
    "finished_at": "2026-03-20T10:31:27Z",
    "logs_url": "https://jenkins.example.com/job/142/console",
    "stages": [
      {"name": "Build", "status": "success", "duration": 22},
      {"name": "Test", "status": "success", "duration": 45},
      {"name": "Deploy", "status": "success", "duration": 20}
    ]
  }
  ```

#### Phase 2: Frontend Dashboard (Week 2)
- Single-page dashboard with sections:
  - **Live status panel** — current running builds, recent completions
  - **Build history table** — sortable, filterable by project/status
  - **Charts** — success/failure trend (line chart), build duration over time, success rate (doughnut)
  - **Stage breakdown** — which stages fail most often
- Use Chart.js for visualizations
- Fetch data from the API using `fetch()`
- Auto-refresh every 30 seconds or use Server-Sent Events (SSE) for real-time updates

#### Phase 3: Docker & Deployment (Week 3)
- Write `Dockerfile` for the FastAPI app
- Write `docker-compose.yml` with services: `app`, `mongodb`, `nginx` (reverse proxy)
- Set up a Jenkinsfile for the dashboard's own CI pipeline:
  - Lint → Test → Build Docker image → Push to registry → Deploy
- Deploy to: Railway, Render, or a small Azure/AWS VM
- Write a comprehensive README with screenshots and setup instructions

#### Phase 4: Testing (Week 3)
- Unit tests with pytest for all API endpoints
- Integration tests verifying webhook → database → API flow
- GitHub Actions workflow: lint → test → build on every push

### Key Skills Demonstrated
Backend Development, REST APIs, Python, Docker, Jenkins, MongoDB, CI/CD, Git/GitHub

### Estimated Effort: 3 weeks

---

## Project 2: Cloud Infrastructure Monitor

### Goal
A monitoring tool that connects to your Azure (and optionally AWS) account, pulls resource metrics (VM status, storage usage, cost estimates), and sends alerts when thresholds are breached. Includes Infrastructure as Code to provision the monitoring infrastructure itself.

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Backend | Python (Flask or FastAPI) | Metric collection, alert logic, API |
| Cloud SDK | Azure SDK for Python (azure-mgmt-*) | Pull Azure resource metrics |
| Cloud SDK (optional) | Boto3 | Pull AWS resource metrics |
| IaC | Terraform or Azure Bicep | Provision Azure resources (VM, storage, monitoring infra) |
| Automation | Shell scripts + Cron | Scheduled metric collection, health checks |
| Database | SQLite or PostgreSQL | Store metric history, alert rules |
| Notifications | SMTP / Slack webhook | Send alerts on threshold breach |
| Monitoring | Grafana | Visualize metric history dashboards |
| Deployment | Docker + GitHub Actions | Containerized deployment with CI |

### Architecture

```
┌─────────────────────────────────────────────┐
│                Azure / AWS                    │
│  VMs, Storage, Databases, IoT Hub, etc.      │
└──────────────────┬──────────────────────────┘
                   │ Azure SDK / Boto3
                   ▼
        ┌─────────────────────┐
        │  Metric Collector   │ ◄── Cron / Scheduled task
        │  (Python service)   │
        └─────────┬───────────┘
                  │
        ┌─────────▼───────────┐
        │   PostgreSQL / SQLite│ ◄── Metric history
        └─────────┬───────────┘
                  │
    ┌─────────────┼─────────────┐
    ▼             ▼             ▼
 Flask API    Grafana       Alert Engine
 (REST)     (dashboards)  (Slack/Email)
```

### Implementation Plan

#### Phase 1: Infrastructure as Code (Week 1)
- Create Terraform (or Bicep) templates to provision:
  - A small Azure VM (B1s free tier) for hosting the monitor
  - Azure Storage account for metric snapshots
  - Network security group with proper rules
  - (Optional) Azure IoT Hub instance for project 4 prep
- Directory structure:
  ```
  cloud-monitor/
  ├── infra/
  │   ├── main.tf              # Provider config, resource group
  │   ├── vm.tf                # VM + NIC + public IP
  │   ├── storage.tf           # Storage account
  │   ├── network.tf           # VNet, subnet, NSG rules
  │   ├── variables.tf         # Configurable params
  │   ├── outputs.tf           # VM IP, connection strings
  │   └── terraform.tfvars     # (gitignored) actual values
  ├── scripts/
  │   ├── setup.sh             # VM bootstrap (install Docker, Python, etc.)
  │   ├── collect_metrics.sh   # Cron wrapper for metric collection
  │   └── health_check.sh      # Basic health check script
  ├── app/
  │   ├── collector.py         # Azure SDK metric collection
  │   ├── alerts.py            # Threshold checking, notification dispatch
  │   ├── api.py               # Flask API for querying metrics
  │   ├── models.py            # DB models for metrics, alerts
  │   └── config.py            # Settings, thresholds, credentials
  ├── grafana/
  │   └── dashboards/
  │       └── cloud-monitor.json  # Pre-configured Grafana dashboard
  ├── docker-compose.yml
  ├── Dockerfile
  └── README.md
  ```

#### Phase 2: Metric Collector (Week 2)
- Python service using `azure-mgmt-compute`, `azure-mgmt-monitor`, `azure-mgmt-storage`
- Collect every 5 minutes via cron:
  - VM CPU %, memory %, disk I/O
  - Storage account usage and blob counts
  - Cost estimates from Azure Cost Management API
  - Resource health status
- Store time-series data in PostgreSQL
- Shell scripts for cron scheduling and log rotation

#### Phase 3: Alert Engine + API (Week 2-3)
- Define alert rules in config (YAML):
  ```yaml
  alerts:
    - name: "High CPU"
      metric: "vm.cpu_percent"
      threshold: 85
      duration: "5m"
      notify: ["slack", "email"]
    - name: "Storage 90%"
      metric: "storage.usage_percent"
      threshold: 90
      notify: ["email"]
  ```
- Alert engine checks rules against latest metrics
- Send notifications via Slack webhook and/or SMTP
- Flask API endpoints:
  - `GET /api/metrics/{resource}` — metric history with time range
  - `GET /api/alerts` — active and historical alerts
  - `GET /api/resources` — list monitored resources with current status

#### Phase 4: Grafana + Deployment (Week 3)
- Grafana connected to PostgreSQL data source
- Pre-built dashboard JSON: CPU/memory over time, cost trend, alert timeline
- Docker Compose for the full stack: app + postgres + grafana
- GitHub Actions: Terraform plan → apply on merge to main
- Comprehensive README with architecture diagram and screenshots

### Key Skills Demonstrated
Azure, AWS, Terraform/IaC, Shell scripting, Linux, Grafana, Monitoring, Python, Docker, Networking

### Estimated Effort: 3 weeks

---

## Project 3: AI-Powered Log Analyzer

### Goal
A CLI tool and web interface that ingests application/server logs, uses an LLM to detect patterns, summarize errors, classify severity, and suggest fixes. Includes a full Robot Framework test suite and CI integration.

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| CLI Tool | Python (Click or Typer) | Command-line interface |
| Web UI | Python (FastAPI) + HTMX | Simple web interface for non-CLI users |
| AI/LLM | OpenAI API (GPT-4) or local Ollama | Log analysis, error summarization, fix suggestions |
| Prompt Engineering | Custom prompt templates | Structured prompts for different log types |
| Testing | Robot Framework | End-to-end test suite with custom Python libraries |
| Unit Testing | pytest + Jest | Backend unit tests |
| CI/CD | GitHub Actions | Lint → Test → Build → Publish |
| Packaging | PyPI (setuptools/poetry) | Distribute as installable CLI package |
| Containerization | Docker | Run as a container |

### Architecture

```
Log Sources (files, stdin, API)
          │
          ▼
   ┌──────────────┐
   │  Log Parser   │ ── Regex + structured parsing
   └──────┬───────┘
          │ Parsed log entries
          ▼
   ┌──────────────┐
   │  LLM Engine   │ ── OpenAI API / Ollama
   │  + Prompt     │ ── Custom prompt templates
   │    Templates  │
   └──────┬───────┘
          │ Analysis results
          ▼
   ┌──────────────┐
   │   Output      │ ── CLI table / JSON / HTML report
   │   Formatter   │
   └──────────────┘
```

### Implementation Plan

#### Phase 1: Core CLI Tool (Week 1)
- Project structure:
  ```
  log-analyzer/
  ├── src/
  │   └── log_analyzer/
  │       ├── __init__.py
  │       ├── cli.py              # Typer CLI commands
  │       ├── parser.py           # Log parsing (syslog, JSON, nginx, custom)
  │       ├── analyzer.py         # LLM integration, analysis orchestration
  │       ├── prompts/
  │       │   ├── error_summary.txt
  │       │   ├── pattern_detect.txt
  │       │   ├── fix_suggest.txt
  │       │   └── severity_classify.txt
  │       ├── formatters/
  │       │   ├── table.py        # Rich terminal output
  │       │   ├── json_out.py     # JSON export
  │       │   └── html_report.py  # HTML report generation
  │       └── config.py           # API keys, model selection, defaults
  ├── tests/
  │   ├── unit/
  │   │   ├── test_parser.py
  │   │   ├── test_analyzer.py
  │   │   └── test_formatters.py
  │   └── robot/
  │       ├── log_analysis.robot
  │       ├── cli_commands.robot
  │       ├── resources/
  │       │   └── sample_logs/
  │       └── libraries/
  │           └── LogAnalyzerLibrary.py  # Custom Robot Framework library
  ├── pyproject.toml
  ├── Dockerfile
  └── README.md
  ```
- CLI commands:
  ```bash
  logai analyze server.log                    # Analyze a log file
  logai analyze --format json server.log      # JSON output
  logai analyze --type nginx access.log       # Specify log type
  logai summarize server.log                  # Quick error summary
  logai suggest server.log                    # Get fix suggestions
  logai report server.log -o report.html      # Generate HTML report
  ```

#### Phase 2: LLM Integration & Prompt Engineering (Week 1-2)
- Prompt templates for different analysis modes:
  - **Error summarization**: "Given these log entries, summarize the errors, group by root cause, and rank by frequency"
  - **Pattern detection**: "Identify recurring patterns, anomalies, and correlations in these logs"
  - **Fix suggestions**: "For each error category, suggest the most likely fix with code examples"
  - **Severity classification**: "Classify each log entry as critical/warning/info with reasoning"
- Support both OpenAI API and local Ollama for offline/private use
- Token-aware chunking: split large log files into LLM-friendly chunks with context overlap
- Cache results to avoid redundant API calls

#### Phase 3: Robot Framework Tests (Week 2)
- Custom Python library (`LogAnalyzerLibrary.py`):
  ```python
  class LogAnalyzerLibrary:
      def analyze_log_file(self, filepath, log_type="auto"):
          """Analyze a log file and return results."""
          ...
      def result_should_contain_errors(self, result, min_count=1):
          """Verify analysis found at least N errors."""
          ...
      def severity_should_be(self, entry, expected_severity):
          """Verify an entry's severity classification."""
          ...
  ```
- Robot test suites:
  - `cli_commands.robot` — test all CLI commands with sample logs
  - `log_analysis.robot` — test analysis accuracy against known log patterns
  - `error_handling.robot` — test behavior with malformed logs, empty files, huge files
- Unit tests with pytest for parser and formatter modules
- Mocked LLM responses for deterministic testing

#### Phase 4: Web UI + CI + Packaging (Week 3)
- FastAPI web interface with HTMX for interactivity:
  - Upload log file → analyze → display results
  - Toggle between summary/patterns/suggestions views
- GitHub Actions CI:
  - Lint (ruff) → Unit tests (pytest) → Robot Framework tests → Build package → Publish to PyPI
- Publish to PyPI as `logai` or `log-analyzer`
- Docker image published to GitHub Container Registry
- README with demo GIF, installation instructions, and usage examples

### Key Skills Demonstrated
AI/LLM Integration, Prompt Engineering, Python, Robot Framework, Test Automation, CI/CD, Docker, PyPI packaging

### Estimated Effort: 3 weeks

---

## Project 4: IoT Sensor Simulator & Platform

### Goal
A complete IoT platform: simulated sensor devices push telemetry (temperature, humidity, vibration) to a cloud-connected backend. Data is stored, processed, and visualized in a real-time dashboard. Can run on Raspberry Pi or as Docker containers.

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Sensor Simulators | Python | Simulated IoT devices generating telemetry |
| Raspberry Pi (optional) | Python + GPIO | Physical sensor reading (DHT22, accelerometer) |
| Message Broker | Azure IoT Hub or MQTT (Mosquitto) | Device-to-cloud communication |
| Backend API | Node.js (Express) | REST API, WebSocket server for real-time data |
| Microservice | Python | Data processing, anomaly detection, aggregation |
| Database | MongoDB | Time-series telemetry storage |
| Dashboard | Vanilla JS + WebSocket + Chart.js | Real-time sensor visualization |
| Infrastructure | Ansible | Automated deployment to target servers |
| Containerization | Docker Compose | Multi-service orchestration |
| CI/CD | GitHub Actions | Build, test, deploy pipeline |

### Architecture

```
┌─────────────────────────────────────────────────┐
│             Sensor Devices                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │ Sensor 1 │ │ Sensor 2 │ │ Sensor 3 │  ...    │
│  │ (Docker) │ │ (Docker) │ │ (RPi)    │         │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘         │
└───────┼─────────────┼────────────┼───────────────┘
        │   MQTT / Azure IoT Hub   │
        └─────────────┬────────────┘
                      ▼
        ┌─────────────────────────┐
        │   MQTT Broker / IoT Hub  │
        └─────────────┬───────────┘
                      │
          ┌───────────┼───────────┐
          ▼                       ▼
  ┌───────────────┐     ┌────────────────┐
  │ Node.js API    │     │ Python Worker   │
  │ (Express +     │     │ (Data processor,│
  │  WebSocket)   │     │  anomaly detect)│
  └───────┬───────┘     └────────┬───────┘
          │                      │
          └──────────┬───────────┘
                     ▼
              ┌────────────┐
              │  MongoDB    │
              └──────┬─────┘
                     ▼
              ┌────────────┐
              │  Dashboard  │ ◄── Real-time WebSocket
              │  (Browser)  │
              └────────────┘
```

### Implementation Plan

#### Phase 1: Sensor Simulators (Week 1)
- Python simulators that generate realistic telemetry:
  ```
  iot-platform/
  ├── simulators/
  │   ├── base_sensor.py       # Abstract base class
  │   ├── temperature.py       # Temperature sensor (-10°C to 45°C with noise)
  │   ├── humidity.py          # Humidity sensor (20%-95%)
  │   ├── vibration.py         # Industrial vibration sensor
  │   ├── config.yaml          # Device IDs, intervals, ranges
  │   └── Dockerfile           # Container for each simulator
  ├── rpi/
  │   ├── dht22_reader.py      # Raspberry Pi DHT22 physical sensor
  │   ├── setup.sh              # RPi setup script
  │   └── requirements.txt
  ```
- Each simulator:
  - Generates data at configurable intervals (1-60 seconds)
  - Publishes to MQTT topic: `devices/{device_id}/telemetry`
  - Payload: `{"device_id": "sensor-01", "type": "temperature", "value": 23.4, "unit": "°C", "timestamp": "..."}`
  - Simulates realistic patterns: gradual drift, spikes, seasonal patterns
  - Optional: real Raspberry Pi with DHT22 sensor reading GPIO pins

#### Phase 2: Message Broker + Backend (Week 1-2)
- Option A: Azure IoT Hub (matches portfolio claims)
  - Register devices, generate SAS tokens
  - Use `azure-iot-device` SDK in simulators
  - Backend reads from IoT Hub built-in Event Hub endpoint
- Option B: Self-hosted Mosquitto MQTT broker (simpler, free)
- Node.js Express backend:
  ```
  ├── backend/
  │   ├── src/
  │   │   ├── server.js          # Express + WebSocket setup
  │   │   ├── routes/
  │   │   │   ├── devices.js     # GET /api/devices, GET /api/devices/:id
  │   │   │   ├── telemetry.js   # GET /api/telemetry?device=X&range=1h
  │   │   │   └── alerts.js      # GET /api/alerts
  │   │   ├── services/
  │   │   │   ├── mqtt.js        # MQTT subscriber, message handler
  │   │   │   └── websocket.js   # WebSocket broadcaster
  │   │   └── models/
  │   │       ├── Device.js      # Mongoose device model
  │   │       └── Telemetry.js   # Mongoose telemetry model (TTL index)
  │   ├── package.json
  │   └── Dockerfile
  ```
- Python data processor microservice:
  ```
  ├── processor/
  │   ├── processor.py           # Subscribes to MQTT, processes data
  │   ├── anomaly.py             # Simple anomaly detection (z-score, threshold)
  │   ├── aggregator.py          # Compute averages, min/max per time window
  │   └── Dockerfile
  ```

#### Phase 3: Real-Time Dashboard (Week 2-3)
- Browser dashboard connected via WebSocket:
  - Live updating line charts per device (last 1 hour)
  - Device status cards (online/offline, last seen, current value)
  - Alert log when anomalies are detected
  - Historical data explorer with time range picker
- Map view (optional): device locations with status indicators

#### Phase 4: Ansible + Docker Compose + CI (Week 3)
- Docker Compose for the full stack:
  ```yaml
  services:
    mqtt:        # Mosquitto broker
    backend:     # Node.js API
    processor:   # Python data worker
    mongodb:     # Database
    simulator-1: # Temperature sensor
    simulator-2: # Humidity sensor
    simulator-3: # Vibration sensor
    dashboard:   # Nginx serving frontend
  ```
- Ansible playbook for remote deployment:
  ```
  ├── ansible/
  │   ├── inventory.yml
  │   ├── playbook.yml          # Install Docker, pull images, start compose
  │   ├── roles/
  │   │   ├── docker/           # Install Docker on target
  │   │   └── deploy/           # Deploy compose stack
  │   └── templates/
  │       └── docker-compose.yml.j2  # Templated compose file
  ```
- GitHub Actions: Test → Build images → Push to GHCR → Deploy via Ansible
- README with architecture diagram, demo GIF, and deployment instructions

### Key Skills Demonstrated
IoT, Azure IoT Hub, Node.js, Express, Microservices, MongoDB, Raspberry Pi, MQTT, Ansible, Docker Compose, WebSocket, Python, Linux

### Estimated Effort: 3-4 weeks

---

## Project 5: Self-Service Deployment Platform

### Goal
A mini-Heroku: push code to a Git repo → it automatically builds, tests, containerizes, deploys to staging, and waits for approval to promote to production. Includes monitoring, rollback, and AI-generated release notes.

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Backend API | Python (FastAPI) | Core platform API |
| Pipeline Engine | Jenkins + Jenkinsfile | Build, test, deploy pipelines |
| Containerization | Docker | Build and run app containers |
| Orchestration | Docker Compose / Docker Swarm | Multi-container deployment |
| Configuration Mgmt | Ansible | Server provisioning, deployment automation |
| Cloud | Azure VM / AWS EC2 | Hosting staging + production environments |
| Database | PostgreSQL | Deployments, users, audit logs |
| AI/LLM | OpenAI API | Auto-generate release notes from git diff |
| Monitoring | Grafana + Prometheus | Post-deployment health monitoring |
| Testing | Robot Framework + pytest | Platform's own test suite |
| Shell | Bash scripts | Build scripts, health checks, rollback automation |
| Frontend | HTML/CSS/JS | Deployment dashboard |
| CI/CD | GitHub Actions | Platform's own CI |

### Architecture

```
Developer
    │
    │ git push
    ▼
┌──────────┐     webhook     ┌──────────────────┐
│  GitHub   │ ──────────────▶ │  FastAPI Backend  │
└──────────┘                 │  (Platform API)   │
                             └────────┬─────────┘
                                      │ trigger
                                      ▼
                             ┌──────────────────┐
                             │     Jenkins       │
                             │  ┌─────────────┐  │
                             │  │ Build Stage  │  │
                             │  │ (Docker)     │  │
                             │  ├─────────────┤  │
                             │  │ Test Stage   │  │
                             │  │ (pytest/RF)  │  │
                             │  ├─────────────┤  │
                             │  │ Deploy Stage │  │
                             │  │ (Ansible)    │  │
                             │  └─────────────┘  │
                             └────────┬─────────┘
                                      │
                          ┌───────────┼───────────┐
                          ▼                       ▼
                   ┌──────────┐           ┌──────────┐
                   │ Staging  │  approve  │Production│
                   │ Server   │ ────────▶ │ Server   │
                   └──────────┘           └──────────┘
                          │                       │
                          └───────────┬───────────┘
                                      ▼
                             ┌──────────────────┐
                             │    Monitoring     │
                             │ Grafana+Prometheus│
                             └──────────────────┘
```

### Implementation Plan

#### Phase 1: Core Platform API (Week 1)
- FastAPI backend:
  ```
  deploy-platform/
  ├── platform/
  │   ├── main.py                # App setup, middleware
  │   ├── routes/
  │   │   ├── apps.py            # CRUD for registered applications
  │   │   ├── deployments.py     # Trigger, status, history, rollback
  │   │   ├── webhooks.py        # GitHub webhook receiver
  │   │   ├── releases.py        # Release notes, approvals
  │   │   └── health.py          # Platform health endpoints
  │   ├── services/
  │   │   ├── jenkins.py         # Jenkins API client (trigger jobs, get status)
  │   │   ├── docker_builder.py  # Build Docker images from repo
  │   │   ├── deployer.py        # Ansible deployment orchestration
  │   │   ├── release_notes.py   # LLM-powered release note generation
  │   │   └── rollback.py        # Rollback to previous deployment
  │   ├── models/
  │   │   ├── app.py             # Application model
  │   │   ├── deployment.py      # Deployment record model
  │   │   └── release.py         # Release model
  │   └── db/
  │       └── postgres.py        # SQLAlchemy + PostgreSQL
  ```
- Key API endpoints:
  - `POST /api/apps` — register a new application (Git repo URL, build config)
  - `POST /api/webhooks/github` — receive push events, trigger pipeline
  - `GET /api/deployments` — list all deployments
  - `POST /api/deployments/{id}/approve` — promote staging → production
  - `POST /api/deployments/{id}/rollback` — rollback to previous version
  - `GET /api/releases/{id}/notes` — AI-generated release notes

#### Phase 2: Jenkins Pipeline + Docker Builds (Week 2)
- Jenkinsfile template (generated per app):
  ```groovy
  pipeline {
    agent any
    stages {
      stage('Checkout') { ... }
      stage('Build Docker Image') { ... }
      stage('Run Tests') { ... }
      stage('Push to Registry') { ... }
      stage('Deploy to Staging') {
        steps { ansiblePlaybook('deploy-staging.yml') }
      }
      stage('Approval') {
        input { message "Deploy to production?" }
      }
      stage('Deploy to Production') {
        steps { ansiblePlaybook('deploy-production.yml') }
      }
    }
    post {
      always { sh 'curl -X POST platform-api/webhook/jenkins ...' }
    }
  }
  ```
- Shell scripts:
  - `scripts/build.sh` — clone repo, build Docker image, tag
  - `scripts/health_check.sh` — post-deploy health verification
  - `scripts/rollback.sh` — stop current, start previous container
  - `scripts/cleanup.sh` — remove old images, prune volumes

#### Phase 3: Ansible Deployment + Monitoring (Week 2-3)
- Ansible playbooks:
  ```
  ├── ansible/
  │   ├── staging.yml            # Deploy to staging server
  │   ├── production.yml         # Deploy to production server
  │   ├── rollback.yml           # Rollback deployment
  │   ├── monitoring.yml          # Set up Grafana + Prometheus
  │   ├── inventory/
  │   │   ├── staging.yml
  │   │   └── production.yml
  │   └── roles/
  │       ├── docker-deploy/     # Pull image, run container, health check
  │       ├── monitoring/        # Install Prometheus exporters, Grafana dashboards
  │       └── nginx/             # Reverse proxy configuration
  ```
- Grafana dashboards:
  - Deployment frequency and success rate
  - Application health (response time, error rate, CPU/memory)
  - Rollback history
- Prometheus scraping deployed app metrics

#### Phase 4: AI Release Notes + Dashboard + Testing (Week 3-4)
- LLM-powered release notes:
  - On each deployment, fetch git diff between current and previous release
  - Send to OpenAI: "Summarize these code changes as user-facing release notes. Group by: features, bug fixes, improvements."
  - Store and display in the dashboard
- Web dashboard:
  - Application list with current deployment status
  - Deployment timeline with stage progress indicator
  - One-click rollback and approval buttons
  - Release notes viewer
  - Monitoring embed (Grafana iframe or custom charts)
- Testing:
  - Robot Framework: end-to-end test of full deployment cycle (register app → push → build → deploy → verify → rollback)
  - pytest: unit tests for all services
  - GitHub Actions CI for the platform itself

### Key Skills Demonstrated
Everything: Python, Node.js, Docker, Jenkins, Ansible, Azure/AWS, REST APIs, PostgreSQL, Shell/Bash, Linux, Grafana, Prometheus, AI/LLM, Robot Framework, pytest, Git, CI/CD, System Design, Microservices

### Estimated Effort: 4 weeks

---

## Timeline Summary

| # | Project | Duration | Key Focus |
|---|---------|----------|-----------|
| 1 | DevOps Pipeline Dashboard | 3 weeks | Backend, Docker, CI/CD, MongoDB |
| 2 | Cloud Infrastructure Monitor | 3 weeks | Azure/AWS, Terraform, Shell, Grafana |
| 3 | AI-Powered Log Analyzer | 3 weeks | AI/LLM, Robot Framework, Testing, PyPI |
| 4 | IoT Sensor Simulator & Platform | 3-4 weeks | IoT, Node.js, Microservices, Ansible, RPi |
| 5 | Self-Service Deployment Platform | 4 weeks | Full stack — everything combined |
| **Total** | | **~16 weeks** | |

## Portfolio Integration

After completing each project:
1. Deploy it with a live demo link
2. Add it to the "Selected Work" section on the Services page (replace placeholder case studies)
3. Write a short case study with: problem → approach → result + metrics
4. Push code to a public GitHub repo with a detailed README, architecture diagram, and screenshots
5. (Optional) Write a LinkedIn post about what you built and learned

## Notes

- All durations assume part-time work (~2-3 hours/day). Full-time would be roughly half.
- Start with Project 1 — it's the most achievable and gives you a deployed project fast.
- Each project's repo should have: README with screenshots, architecture diagram, Docker setup, CI badge, and proper .gitignore.
- Adjust the specific numbers (metrics, thresholds, etc.) based on your real experience.

---

## How to Prompt an AI Agent While Building

The goal is to code it yourself and use AI as a pair programmer — not to generate the whole project. Break work into small, specific prompts where you drive the architecture.

### Prompting Strategy

#### 1. Start with scaffolding — you decide the structure

**Don't say:**
> "Build me a DevOps pipeline dashboard"

**Say:**
> "I'm building a DevOps pipeline dashboard with FastAPI, MongoDB, and Docker. Here's my folder structure: [paste your structure]. Create the initial `main.py` with FastAPI app setup, CORS middleware, and route registration for these routers: builds, webhooks, metrics. No business logic yet — just the skeleton."

#### 2. One file or one feature per prompt

**Don't say:**
> "Write all the API endpoints"

**Say:**
> "I have a FastAPI app. Write the `routes/webhooks.py` file that:
> - Accepts POST /webhook/jenkins with this JSON payload: [paste example]
> - Validates the payload using a Pydantic model
> - Stores it in MongoDB using motor (async)
> - Returns 201 with the created build ID
>
> Here's my existing Pydantic model in models/build.py: [paste it]"

#### 3. Show your existing code for context

Always paste the relevant files you've already written. This keeps the agent aligned with your patterns:

> "Here's my current `db/mongo.py`: [paste]. Now write a function `get_builds_by_status(status: str, limit: int)` that queries MongoDB and returns paginated results."

#### 4. Ask for explanations when learning

> "I wrote this Ansible playbook to deploy a Docker container: [paste]. Review it and tell me:
> 1. What's wrong or could fail?
> 2. What would you change for production?
> 3. Explain what the `become: yes` directive does."

#### 5. Use the agent for the boring parts

Let the agent handle boilerplate while you focus on logic:
- "Generate a Dockerfile for this Python FastAPI app. Here's my requirements.txt: [paste]"
- "Write a docker-compose.yml with services for: fastapi app on port 8000, mongodb on 27017, and nginx reverse proxy"
- "Generate a GitHub Actions workflow that runs pytest and ruff on every push to main"

#### 6. Debugging — always share the error + your code

> "I'm getting this error when connecting to MongoDB in Docker Compose:
> ```
> [error message]
> ```
> Here's my docker-compose.yml: [paste]
> Here's my mongo.py connection code: [paste]
> What's wrong?"

---

### Example Prompts Per Project

#### Project 1: DevOps Pipeline Dashboard

**Phase 1:**
- "Set up a FastAPI project skeleton with this structure: [paste]. Include main.py with CORS, router registration, and startup/shutdown hooks for MongoDB connection."
- "Write the Pydantic models for a CI/CD build record with these fields: [list fields]. Include validation for status enum and ISO datetime."
- "Write the MongoDB CRUD functions using motor for builds: insert_one, find_with_pagination, find_by_id, aggregate_metrics."
- "Write the POST /webhook/jenkins endpoint that receives [paste Jenkins webhook payload format], maps it to my build model, and stores it."

**Phase 2:**
- "I have this API returning build data as JSON: [paste example response]. Write a vanilla JS dashboard that fetches /api/builds and displays them in a table with sorting. Use Chart.js for a success/failure line chart."
- "Add Server-Sent Events (SSE) to my FastAPI app so the dashboard updates in real-time when new builds come in. Here's my current main.py: [paste]."

**Phase 3:**
- "Write a Dockerfile for this FastAPI app. Here's my requirements.txt: [paste]. Use multi-stage build."
- "Write a docker-compose.yml with: fastapi (build from ./), mongodb:7, nginx reverse proxy. Include health checks."
- "Write pytest tests for these endpoints: [list]. Here's my routes file: [paste]. Mock the MongoDB calls."

#### Project 2: Cloud Infrastructure Monitor

- "Write a Terraform config to provision an Azure resource group, a B1s VM with Ubuntu 22.04, a VNet with one subnet, an NSG allowing SSH and port 8080, and a public IP. Use variables for resource names and location."
- "Write a Python script using azure-mgmt-monitor SDK that fetches CPU percentage for a VM over the last hour. Here's how I'm authenticating: [paste]. Return the data as a list of (timestamp, value) tuples."
- "I have metric data stored in PostgreSQL with this schema: [paste]. Write a Flask endpoint GET /api/metrics/{resource_id} that accepts query params ?start=...&end=... and returns time-series data."
- "Write a shell script that runs as a cron job every 5 minutes: calls my Python metric collector, logs output to /var/log/cloud-monitor.log with rotation, and sends a Slack webhook if the exit code is non-zero."

#### Project 3: AI-Powered Log Analyzer

- "I'm building a CLI log analyzer with Typer. Write the parser module that can detect and parse these log formats: syslog, JSON lines, nginx access log. Each parser should return a list of LogEntry objects with: timestamp, level, message, source. Here's my LogEntry dataclass: [paste]."
- "Write a prompt template for OpenAI GPT-4 that takes a batch of parsed log entries (max 50) and returns: error summary, grouped by root cause, with count and severity. Return as structured JSON. Include few-shot examples in the prompt."
- "Write a custom Robot Framework library in Python for testing my log analyzer CLI. It should have these keywords: Analyze Log File, Result Should Contain Errors, Severity Should Be, Output Format Should Be. Here's how my CLI works: [paste example commands and output]."
- "Write a Robot Framework test suite that tests these scenarios: analyze a valid syslog file, analyze an empty file (should handle gracefully), analyze a huge file (>10MB), analyze JSON logs with nested fields."

#### Project 4: IoT Sensor Simulator & Platform

- "Write a Python class TemperatureSensor that simulates realistic temperature readings. It should: start at a base temp, drift gradually with Gaussian noise, occasionally spike, support configurable min/max/interval. It should publish to MQTT topic devices/{device_id}/telemetry using paho-mqtt."
- "Write an Express.js server that subscribes to MQTT topic devices/+/telemetry, parses messages, stores in MongoDB using Mongoose, and broadcasts to connected WebSocket clients. Here's my Mongoose schema: [paste]."
- "Write an Ansible playbook that deploys this docker-compose stack to a remote Ubuntu server: [paste compose file]. It should: install Docker if missing, copy the compose file, pull images, start the stack, and verify health."

#### Project 5: Self-Service Deployment Platform

- "Write a FastAPI endpoint POST /api/webhooks/github that receives a GitHub push event, extracts repo URL, branch, commit SHA, and committer. Then triggers a Jenkins job via Jenkins API using these credentials: [paste config structure]. Here's my current Jenkins API client: [paste]."
- "Write a Python function that takes a git diff string and calls OpenAI to generate user-facing release notes. Group by: new features, bug fixes, improvements. Format as markdown. Include error handling for API failures and rate limiting."
- "Write a Jenkinsfile with these stages: checkout, build docker image, run pytest, run robot framework tests, deploy to staging via ansible, wait for manual approval, deploy to production. Here's my ansible playbook path and inventory structure: [paste]."

---

### Golden Rules

1. **One thing at a time** — one file, one feature, one problem per prompt
2. **Always share context** — paste your existing code, folder structure, and what you've already decided
3. **You make the decisions** — you decide the architecture, tech choices, and folder structure. The agent implements.
4. **Ask "why" not just "how"** — when the agent writes something you don't understand, ask it to explain
5. **Review everything** — never copy-paste blindly. Read line by line, understand it, then use it.
6. **Test yourself first** — try writing the code yourself first. If you're stuck, show the agent your attempt and ask what's wrong.

---

# Learning Projects — Build to Understand

## Why These Projects?

The 5 projects above are portfolio showcase pieces. The 6 projects below are **learning exercises** — designed so you actually understand the tools and concepts in your stack, not just use them. Each project is scoped small enough to finish in a few days, but deep enough to teach you *why* things work the way they do.

The prompts are written so that when you use AI as a pair programmer, it explains its reasoning. You're not copying code — you're having a conversation about software engineering while building something real.

**How to use these:**
1. Read the "What You'll Learn" section first — these are your learning objectives
2. Try each phase yourself for 20–30 minutes before using the prompts
3. When you do use the prompts, read every line of the generated code and ask follow-up questions when something is unclear
4. After each phase, write a 2–3 sentence note about what you learned (keep a `NOTES.md` in the repo)

---

## Project 6: Real-Time Data Pipeline

**Repo name:** `realtime-data-pipeline`

### What You Build
Simulated sensors push data over MQTT → a Python service consumes and stores it in PostgreSQL → Grafana visualises it. The whole thing runs in Docker Compose.

### What You'll Learn
- **Message brokers (MQTT):** How pub/sub works, what QoS levels mean, why MQTT is used in IoT instead of HTTP
- **Database design for time-series data:** Why indexes matter, what a composite index does, when to partition tables
- **Connection pooling:** Why opening a new DB connection per message kills performance, how pools work
- **Docker networking:** How containers find each other by service name, what Docker's internal DNS does
- **Grafana provisioning:** How to auto-configure dashboards and datasources instead of clicking through the UI

### Tech Stack
Python, paho-mqtt, Mosquitto, PostgreSQL, psycopg2, Grafana, Docker Compose, SQL

### Folder Structure
```
realtime-data-pipeline/
├── docker-compose.yml
├── mosquitto/
│   └── mosquitto.conf
├── subscriber/
│   ├── main.py                # MQTT subscriber → PostgreSQL
│   ├── db.py                  # Connection pool, insert logic
│   ├── requirements.txt
│   └── Dockerfile
├── simulator/
│   ├── sensor.py              # Generates fake data
│   ├── requirements.txt
│   └── Dockerfile
├── grafana/
│   └── provisioning/
│       ├── datasources/
│       │   └── postgres.yml
│       └── dashboards/
│           ├── dashboard.yml
│           └── telemetry.json
├── sql/
│   └── init.sql
├── .env.example
├── NOTES.md                   # Your learning notes
└── README.md
```

### Step-by-Step Prompts

**Phase 1 — Understand the database layer**

> "I'm learning about database design for time-series data. I need a PostgreSQL table to store sensor readings with columns: id (BIGSERIAL), device_id (VARCHAR 64), metric (VARCHAR 32), value (DOUBLE PRECISION), ts (TIMESTAMPTZ DEFAULT NOW()). Write the `init.sql` and then **explain to me:**
> 1. Why TIMESTAMPTZ instead of TIMESTAMP?
> 2. Why I need an index on `(ts DESC)` — what happens without it when Grafana queries the last 6 hours?
> 3. Why a composite index on `(device_id, ts DESC)` is different from two separate indexes
> 4. At what row count should I start thinking about table partitioning, and how does PostgreSQL native partitioning work?"

> "Now I need a Python module `db.py` that connects to PostgreSQL with a connection pool. Use `psycopg2.pool.ThreadedConnectionPool` (min=2, max=10). Write two functions: `init_pool(dsn)` and `insert_telemetry(device_id, metric, value)`. But before writing the code, **explain to me:**
> 1. What is a connection pool and why would I need one? (explain with the analogy of a restaurant with 10 tables vs seating people one at a time)
> 2. What happens if I don't return the connection to the pool after an error?
> 3. What does `ThreadedConnectionPool` do differently from `SimpleConnectionPool`?
> Then write the code with comments on each section."

**Phase 2 — Understand MQTT**

> "I'm learning about MQTT. Write a Python MQTT subscriber (`main.py`) using paho-mqtt that connects to a broker, subscribes to `devices/+/telemetry` with QoS 1, and parses JSON messages. Before writing the code, **teach me:**
> 1. What does the `+` wildcard mean in MQTT topics? How is it different from `#`?
> 2. What are QoS 0, 1, and 2? Which should I use for sensor data and why?
> 3. What is `loop_forever()` vs `loop_start()`? When would I use each?
> 4. What happens to messages if my subscriber is offline? (explain retained messages and clean sessions)
> Then write the subscriber with comments explaining each callback."

> "Write a simulator script that creates 5 fake sensors publishing temperature data to MQTT every 2 seconds. Use Gaussian noise for realism. **Explain:** why Gaussian noise instead of uniform random? What does a real sensor's output look like vs pure random numbers?"

**Phase 3 — Understand Docker Compose**

> "I need a `docker-compose.yml` to run 5 services: mqtt broker (mosquitto), postgres, my subscriber, my simulator, and grafana. Before writing it, **explain these concepts to me:**
> 1. What does `depends_on: { db: { condition: service_healthy } }` do? Why isn't plain `depends_on: [db]` enough?
> 2. What's a Docker health check and how does the container runtime use it?
> 3. What's the difference between a named volume (`pgdata:`) and a bind mount (`./sql:/docker-entrypoint-initdb.d/`)?
> 4. Why do I put all services on a shared network? Could the simulator talk to the db directly — and should it?
> 5. What does `/docker-entrypoint-initdb.d/` do in the postgres image?
> Then write the compose file with inline comments."

**Phase 4 — Understand Grafana auto-provisioning**

> "I want Grafana to start with a PostgreSQL datasource and dashboard already configured — no manual clicking. **Explain:** what is Grafana provisioning? How does it differ from importing a dashboard manually? Then write the YAML datasource config and a JSON dashboard with 3 panels (time-series, stat, table) with comments explaining the Grafana JSON structure."

---

## Project 7: CI/CD Pipeline From Scratch

**Repo name:** `cicd-pipeline-demo`

### What You Build
A working CI/CD pipeline: sample Python app → lint → unit tests → Robot Framework integration tests → Docker image → staged deployment with manual approval. Uses Jenkins (or GitHub Actions if you don't have Jenkins locally).

### What You'll Learn
- **Pipeline-as-code:** Why Jenkinsfiles exist, what declarative vs scripted pipelines mean
- **Testing pyramid:** Why lint runs first, then unit tests, then integration tests — and why order matters
- **Robot Framework custom libraries:** How to extend RF with Python, what library scope means
- **Docker multi-stage builds:** Why the build image and runtime image should be different
- **Deployment gates:** Why manual approval stages exist, when to use them vs fully automated deploys
- **Idempotent deployments:** Why you use Ansible instead of SSH + shell scripts

### Tech Stack
Jenkins (or GitHub Actions), Docker, pytest, ruff, Robot Framework, Python, Ansible, Bash

### Folder Structure
```
cicd-pipeline-demo/
├── Jenkinsfile                # (or .github/workflows/pipeline.yml)
├── Dockerfile
├── requirements.txt
├── src/
│   ├── app.py                 # Minimal FastAPI app
│   ├── routes/
│   │   ├── devices.py
│   │   └── telemetry.py
│   └── config.py
├── tests/
│   ├── unit/
│   │   ├── test_devices.py
│   │   └── test_telemetry.py
│   └── robot/
│       ├── smoke_test.robot
│       ├── device_api.robot
│       └── libraries/
│           └── ApiTestLibrary.py
├── ansible/
│   ├── deploy.yml
│   └── inventory/
│       └── staging.yml
├── scripts/
│   └── notify.sh
├── NOTES.md
└── README.md
```

### Step-by-Step Prompts

**Phase 1 — Build something to deploy**

> "I'm learning about CI/CD. First I need a small app to put through a pipeline. Write a minimal FastAPI app with two route files: one for devices (GET list, GET by id) and one for telemetry (POST to submit, GET to list). Keep it simple — in-memory storage is fine. **While writing it, explain:**
> 1. Why do I separate routes into different files instead of putting everything in main.py?
> 2. What is Pydantic validation and why does FastAPI use it instead of manual `if` checks?
> 3. What does the 422 status code mean and when does FastAPI return it automatically?"

> "Write a multi-stage Dockerfile for this app. **Before the code, teach me:**
> 1. What is a multi-stage build? Draw the two stages as boxes and explain what goes in each.
> 2. Why does `--no-cache-dir` matter in a Docker image? What's the size difference?
> 3. Why should I run as a non-root user inside the container? What attack does this prevent?
> 4. Why `COPY requirements.txt` before `COPY .` — what does this do for layer caching?"

**Phase 2 — Write the tests (learn the testing pyramid)**

> "I need tests for my FastAPI app. **First explain the testing pyramid to me:**
> 1. What are unit tests, integration tests, and end-to-end tests?
> 2. Why are there more unit tests at the bottom and fewer E2E tests at the top?
> 3. In a CI pipeline, why should unit tests run before integration tests?
> Then write pytest unit tests using FastAPI's TestClient. Test happy paths and error cases (404, 422). Write them in a way where each test name describes the expected behavior."

> "Now I want to write Robot Framework tests. **First explain:**
> 1. What is Robot Framework and why would someone use it instead of just pytest?
> 2. What is the difference between keyword-driven testing and code-driven testing?
> 3. What does `ROBOT_LIBRARY_SCOPE` do? Explain TEST CASE vs TEST SUITE vs GLOBAL with a database connection example.
> Then write a custom Python library `ApiTestLibrary.py` that wraps HTTP calls to my FastAPI app. Use the `requests` library. Write test suites `smoke_test.robot` and `device_api.robot`."

**Phase 3 — The pipeline itself**

> "Now write a Jenkinsfile (declarative pipeline) with stages: Lint, Unit Tests, Robot Framework, Build Docker Image, Deploy to Staging, Approval, Deploy to Production. **For each stage, explain to me:**
> 1. Lint — what does `ruff` check for? Why run it before any tests?
> 2. Unit Tests — what does `--junitxml=report.xml` do and why does Jenkins need it?
> 3. Robot Framework — what is the `passThreshold: 95.0` and why not 100%?
> 4. Build — why tag the image with `BUILD_NUMBER` instead of `latest`?
> 5. Approval — what's an `input` step? Why would you want a human in the loop?
> 6. Post/failure — why send a notification on failure but not on success?
> Write the Jenkinsfile with comments explaining each block."

> "If I don't have Jenkins locally, write the same pipeline as a GitHub Actions workflow. **Explain:** what's the difference between Jenkins and GitHub Actions? Which parts map to which?"

**Phase 4 — Deployment with Ansible**

> "Write an Ansible playbook that deploys my Docker container to a remote server. **But first teach me:**
> 1. What is Ansible and why not just use `ssh user@server 'docker pull ... && docker run ...'`?
> 2. What does 'idempotent' mean? Give me an example of an idempotent task vs a non-idempotent one.
> 3. What is an Ansible role vs a playbook vs a task?
> 4. What is an inventory file and why do I have separate ones for staging and production?
> Then write the playbook with a health check that fails the deployment if the app doesn't respond."

---

## Project 8: Infrastructure as Code

**Repo name:** `infrastructure-as-code`

### What You Build
Terraform configs that provision real Azure infrastructure: resource group, virtual network, IoT Hub, storage — with remote state, reusable modules, and a CI workflow that runs `terraform plan` on PRs.

### What You'll Learn
- **IaC fundamentals:** What "infrastructure as code" means, why clicking in a portal is a problem at scale
- **Terraform concepts:** Providers, resources, state, plan vs apply, modules, variables, outputs
- **Remote state:** Why local state files break in a team, how state locking prevents corruption
- **Networking basics:** VNets, subnets, NSGs, CIDR notation, why you segment networks
- **Lifecycle management:** What `prevent_destroy` does, how to handle state drift
- **CI for infrastructure:** Why you run `terraform plan` on PRs and `apply` on merge

### Tech Stack
Terraform, HCL, Azure, Azure IoT Hub, Azure Storage, Bash, GitHub Actions

### Folder Structure
```
infrastructure-as-code/
├── modules/
│   ├── networking/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── iot/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── storage/
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
├── environments/
│   ├── staging/
│   │   ├── main.tf
│   │   ├── backend.tf
│   │   └── terraform.tfvars
│   └── production/
│       ├── main.tf
│       ├── backend.tf
│       └── terraform.tfvars
├── scripts/
│   ├── bootstrap-state.sh
│   └── plan-and-apply.sh
├── .github/
│   └── workflows/
│       └── terraform.yml
├── NOTES.md
└── README.md
```

### Step-by-Step Prompts

**Phase 1 — Understand the fundamentals**

> "I'm learning Terraform from scratch. Before writing any code, **explain these concepts to me like I'm a developer who has only used cloud portals before:**
> 1. What is Infrastructure as Code? Why can't I just click 'Create VM' in the Azure portal?
> 2. What is Terraform state? Why does Terraform need to remember what it created?
> 3. What does `terraform plan` show me? What does `terraform apply` do? Why are they separate commands?
> 4. What is a Terraform provider? Why do I need to declare one for Azure?
> 5. What is HCL and how is it different from YAML or JSON?
> Give me a simple example: create one Azure resource group. Walk me through every line."

> "Now explain Terraform modules to me. **Use this analogy:** I have a function `create_vm(name, size, region)` — how is a Terraform module similar to that? Why would I create a module vs writing all resources in one file? What are `variables.tf`, `outputs.tf`, and `main.tf` — map them to function parameters, return values, and function body."

**Phase 2 — Build the networking module**

> "Write a Terraform module at `modules/networking/` that creates: a resource group, a VNet (10.0.0.0/16), two subnets (backend 10.0.1.0/24, iot 10.0.2.0/24), and an NSG. **Before writing, teach me:**
> 1. What is a VNet — explain it like a physical office building with floors
> 2. What is CIDR notation? What does /16 vs /24 mean in terms of available addresses?
> 3. What is an NSG and why do I need one? What happens to traffic without NSG rules?
> 4. Why would I restrict MQTT (port 1883) access to only the iot subnet instead of allowing it from anywhere?
> Then write the module with comments explaining each resource block."

**Phase 3 — IoT Hub + Storage modules**

> "Write two more modules: `modules/iot/` for Azure IoT Hub and `modules/storage/` for Azure Storage. The IoT Hub should route device messages to a storage container. **Explain:**
> 1. What does `lifecycle { prevent_destroy = true }` do? When would Terraform try to destroy a resource, and why is that scary for a database?
> 2. What are Terraform outputs? Why would the storage module output a connection string that the IoT module needs?
> 3. How do modules pass data to each other — compare it to function return values being passed as arguments to another function."

**Phase 4 — Remote state and environments**

> "I want staging and production environments using the same modules but different values. **Explain:**
> 1. What is remote state? Why can't I just commit `terraform.tfstate` to git?
> 2. What is state locking? What happens if two people run `terraform apply` at the same time without locking?
> 3. How does the `environments/` folder pattern work — how do staging and production share module code but differ in configuration?
> Write `environments/staging/main.tf` that calls all three modules, `backend.tf` for Azure Storage remote state, and `terraform.tfvars` with staging values. Explain the difference from what production would look like."

**Phase 5 — CI for infrastructure**

> "Write a GitHub Actions workflow that runs `terraform plan` on pull requests and `terraform apply` on merges to main. **Explain:**
> 1. Why plan on PRs and apply on merge — not the other way around?
> 2. What is `-out=tfplan` and why is it important for safety?
> 3. What is OIDC authentication with Azure? Why is it better than putting a client secret in GitHub secrets?
> Write the workflow with comments, and also write a `scripts/bootstrap-state.sh` that creates the storage account for remote state (explain why this is a manual one-time step)."

---

## Project 9: Production-Ready API Template

**Repo name:** `fastapi-production-template`

### What You Build
A FastAPI app running behind Nginx with PostgreSQL and Redis, all in Docker Compose. Multi-stage Dockerfile, health checks, caching, and proper secret management. A template you'll reuse for every future Python API project.

### What You'll Learn
- **Reverse proxies:** What Nginx does in front of an app server, why you don't expose Uvicorn directly
- **Caching patterns:** How Redis sits between your app and database, when to cache vs not cache
- **Health checks:** How container orchestrators use health endpoints to decide if your app is alive
- **Secret management:** Why `.env` files exist, why they never go in git, what the alternatives are in production
- **Multi-stage Docker builds:** How to keep images small by separating build-time and runtime dependencies
- **Async database access:** How async SQLAlchemy differs from synchronous, when it matters

### Tech Stack
Docker, Docker Compose, FastAPI, Uvicorn, PostgreSQL, SQLAlchemy, Redis, Nginx, Python

### Folder Structure
```
fastapi-production-template/
├── docker-compose.yml
├── .env.example
├── app/
│   ├── main.py
│   ├── routes/
│   │   ├── items.py
│   │   └── health.py
│   ├── services/
│   │   ├── cache.py
│   │   └── database.py
│   ├── models.py
│   ├── requirements.txt
│   └── Dockerfile
├── nginx/
│   └── nginx.conf
├── static/
│   └── index.html
├── tests/
│   ├── test_items.py
│   └── test_health.py
├── NOTES.md
└── README.md
```

### Step-by-Step Prompts

**Phase 1 — Understand the architecture first**

> "I'm building a production-ready FastAPI setup. Before any code, **draw me the architecture and explain each layer:**
> 1. Why does Nginx sit in front of Uvicorn? What would go wrong if I exposed Uvicorn directly to the internet?
> 2. What is a reverse proxy? How is it different from a forward proxy (like a VPN)?
> 3. Why use Redis as a cache? What's the difference between caching in Redis vs caching in Python memory (a dict)?
> 4. What happens to the cached data when the app restarts? What about when Redis restarts?
> 5. Why do I need a `.env` file? What should NEVER go in `docker-compose.yml` directly?
> Draw an ASCII diagram showing: Client → Nginx → Uvicorn/FastAPI → PostgreSQL + Redis"

**Phase 2 — Database layer**

> "Write `services/database.py` with async SQLAlchemy setup. **But first teach me:**
> 1. What is SQLAlchemy and why use it instead of raw SQL with psycopg2?
> 2. What is an ORM? What are the pros and cons?
> 3. What does 'async' mean for database access? When does it actually improve performance vs regular synchronous code?
> 4. What is a database session and why do I need `get_db` as a dependency in FastAPI?
> Then write the code with a simple Item model (id, name, description, created_at)."

**Phase 3 — Caching layer**

> "Write `services/cache.py` with Redis helpers: `get_cached(key)`, `set_cached(key, value, ttl)`, `invalidate(key)`. **Teach me:**
> 1. What is a cache TTL? How do I decide whether it should be 30 seconds or 5 minutes?
> 2. What is the 'cache invalidation problem' and why is it called one of the two hard things in computer science?
> 3. Should the app crash if Redis is down? Why or why not? What pattern handles this? (explain graceful degradation)
> 4. What is a cache stampede? When 1000 requests hit a cold cache at the same time, what happens?
> Write the code so that Redis being unavailable never crashes the app — explain each error handling decision."

**Phase 4 — Routes with caching**

> "Write CRUD routes for the Item model. GET /api/items should use Redis caching. POST/PUT/DELETE should invalidate the cache. **Explain:**
> 1. Why cache the GET but invalidate on write? What would happen if I didn't invalidate?
> 2. What is the 'read-through cache' pattern vs 'write-through'? Which am I implementing?
> 3. Write a health endpoint that actually pings both PostgreSQL and Redis — explain why a health check should test real dependencies, not just return `{ 'status': 'ok' }`."

**Phase 5 — Docker + Nginx**

> "Write the Dockerfile (multi-stage), docker-compose.yml (4 services), and nginx.conf. **For each, teach me:**
> 1. Dockerfile: What does `COPY --from=builder /install /usr/local` actually do? Why is the final image smaller?
> 2. Compose: What does `condition: service_healthy` do that regular `depends_on` can't?
> 3. Nginx: What do the `proxy_set_header` lines do? What breaks if I skip `X-Forwarded-For`?
> 4. Nginx: Why serve static files from Nginx instead of through FastAPI? What's the performance difference?
> Write all three files with inline comments explaining each decision."

**Phase 6 — Tests**

> "Write pytest tests using TestClient. **First explain:**
> 1. How does FastAPI TestClient work? Does it actually start a server?
> 2. How do I override the database dependency to use SQLite in tests? Why not test against the real PostgreSQL?
> 3. What's a test fixture in pytest? How is it different from a setup/teardown method?
> Write tests that cover the full CRUD lifecycle and the health endpoint."

---

## Project 10: Server Automation Playbooks

**Repo name:** `server-automation`

### What You Build
Ansible playbooks that provision a fresh Ubuntu server: install packages, harden SSH, configure firewall, install Docker, deploy a Dockerised app with templated configs, encrypted secrets.

### What You'll Learn
- **Configuration management:** What Ansible does and why it exists (not just for deployment)
- **Idempotency:** The most important concept in automation — why running a playbook twice should be safe
- **SSH hardening:** Why disable root login, why disable password auth, what fail2ban does
- **Firewalls (UFW):** What a firewall actually does at the network level, default deny vs allow
- **Jinja2 templating:** How config files are generated dynamically, how Ansible variables flow
- **Secrets management:** What Ansible Vault encrypts, why plaintext secrets in git repos is dangerous

### Tech Stack
Ansible, Ansible Vault, Jinja2, Linux, UFW, fail2ban, SSH, Docker, Docker Compose, Bash

### Folder Structure
```
server-automation/
├── ansible.cfg
├── inventory/
│   ├── staging.yml
│   └── production.yml
├── group_vars/
│   ├── all.yml
│   └── production.yml         # Vault-encrypted
├── roles/
│   ├── common/
│   │   ├── tasks/main.yml
│   │   └── handlers/main.yml
│   ├── docker/
│   │   └── tasks/main.yml
│   ├── app-deploy/
│   │   ├── tasks/main.yml
│   │   └── templates/
│   │       └── docker-compose.yml.j2
│   └── monitoring/
│       └── tasks/main.yml
├── playbooks/
│   ├── provision.yml
│   ├── deploy.yml
│   └── monitoring.yml
├── NOTES.md
└── README.md
```

### Step-by-Step Prompts

**Phase 1 — Understand Ansible before writing anything**

> "I'm learning Ansible from zero. **Explain these concepts to me before I write any code:**
> 1. What is Ansible and what problem does it solve? (use an analogy: imagine you have 20 servers and need to update a config file on all of them)
> 2. What is a playbook, a role, a task, and a handler? How do they relate to each other? (use a cooking analogy: recipe book → recipe → steps → 'call me when the oven is ready')
> 3. What does 'idempotent' mean? Give me 3 examples: a task that IS idempotent, a task that IS NOT, and how to fix the non-idempotent one
> 4. What is an inventory file? Why do I have a separate one for staging vs production?
> 5. How does Ansible connect to servers — does it install an agent? (explain agentless with SSH)
> 6. What is `become: true` — why do some tasks need it and others don't?"

**Phase 2 — Security hardening role**

> "Write `roles/common/tasks/main.yml` that: updates apt, installs curl/git/ufw/fail2ban/unattended-upgrades, configures UFW (allow 22/80/443, default deny), disables root SSH login, disables password SSH. **For each task, explain:**
> 1. Why `cache_valid_time: 3600` on apt update? What happens if I skip it?
> 2. What is UFW and what is it actually doing at the Linux kernel level? (briefly explain iptables)
> 3. Why 'default deny' is the right firewall policy — what does this mean for a new port I forget to open?
> 4. Why disable root login? What's a privilege escalation attack?
> 5. Why disable password auth? What is brute-force SSH and how does key-only auth prevent it?
> 6. What does fail2ban do? How does it detect and block brute-force attempts?
> Write the handler for restarting sshd and explain: why use a handler instead of a task? When does the handler actually run?"

**Phase 3 — Docker installation role**

> "Write `roles/docker/tasks/main.yml` to install Docker on Ubuntu. **Explain:**
> 1. Why install Docker from Docker's repo instead of Ubuntu's default `docker.io` package?
> 2. What is `apt_key` doing? What is a GPG key and why do package managers need them? (explain supply chain security simply)
> 3. Why add the `deploy` user to the `docker` group? What's the alternative? (explain running docker without sudo vs with sudo)
> 4. What does 'enabled: true' on a service mean? (explain systemd service management)"

**Phase 4 — App deployment with templates**

> "Write `roles/app-deploy/tasks/main.yml` that templates a docker-compose file and deploys it. **Teach me:**
> 1. What is Jinja2 templating? Show me how `{{ db_password }}` gets replaced — where does the value come from?
> 2. What is the flow of variables in Ansible? (group_vars → role vars → extra vars — explain precedence)
> 3. Why set file mode `0600` on docker-compose.yml — what do the numbers mean? (explain Unix file permissions: owner/group/other, read/write/execute)
> 4. After deploying, why run a health check? What should happen if it fails?
> Write the Jinja2 template and the deployment tasks with comments."

**Phase 5 — Secrets with Ansible Vault**

> "Show me how to use Ansible Vault. **Explain:**
> 1. What does Ansible Vault encrypt? Where does the encryption key live?
> 2. What's the difference between `--ask-vault-pass` and `--vault-password-file`? Which is used in CI?
> 3. Can I commit vault-encrypted files to git? Is that safe? (explain the cryptographic guarantee)
> 4. What happens if someone gets the encrypted file but not the password?
> Write `group_vars/production.yml` with example secrets, show me how to encrypt it, and show how a playbook reads the decrypted values."

**Phase 6 — Dry runs and linting**

> "Explain `--check` (dry run) mode: what it does, when to use it, and what it CAN'T catch. Then explain ansible-lint: what rules it checks for and show me 3 examples of common mistakes it catches. Why should I run `ansible-lint` in CI before any real deployment?"

---

## Project 11: Test Automation Framework

**Repo name:** `test-automation-framework`

### What You Build
A Robot Framework test suite with custom Python libraries — an MQTT testing library, a JSON schema validator, and an API test library. Tests exercise real services (MQTT broker, REST API) and run in CI.

### What You'll Learn
- **Test automation philosophy:** Why automated tests exist, what they catch that manual testing misses
- **Robot Framework architecture:** Keywords, libraries, suites — how the framework finds and runs your code
- **Custom Python libraries:** How to write Python that Robot Framework can call as keywords
- **Threading and concurrency:** Why MQTT callbacks need locks, what a race condition is
- **JSON Schema validation:** How to validate data structure without writing if/else chains
- **CI test integration:** How tests run in GitHub Actions, what artifacts are, why test reports matter

### Tech Stack
Robot Framework, Python, paho-mqtt, jsonschema, requests, GitHub Actions

### Folder Structure
```
test-automation-framework/
├── libraries/
│   ├── MqttTestLibrary.py
│   ├── PayloadValidator.py
│   └── ApiTestLibrary.py
├── resources/
│   ├── common.resource
│   └── schemas/
│       ├── telemetry.json
│       └── device_status.json
├── suites/
│   ├── mqtt_integration.robot
│   ├── api_tests.robot
│   ├── payload_validation.robot
│   └── smoke.robot
├── results/                   # .gitignore'd
├── requirements.txt
├── .github/
│   └── workflows/
│       └── tests.yml
├── NOTES.md
└── README.md
```

### Step-by-Step Prompts

**Phase 1 — Understand Robot Framework**

> "I'm learning Robot Framework. **Before any code, explain:**
> 1. What is Robot Framework and what niche does it fill? Why would someone use it instead of just writing pytest tests?
> 2. What is keyword-driven testing? How is `Subscribe To Topic    devices/temp    qos=1` different from `client.subscribe('devices/temp', qos=1)` — and why would a QA engineer prefer the first?
> 3. How does Robot Framework discover Python libraries? What does it do with a method called `wait_for_message` — how does it become the keyword `Wait For Message`?
> 4. What is `ROBOT_LIBRARY_SCOPE`? Explain TEST CASE, TEST SUITE, and GLOBAL using a database connection example: why creating a new connection per test case is wasteful but using GLOBAL scope causes flaky tests.
> 5. What are Suite Setup and Suite Teardown — when should I use them?"

**Phase 2 — MQTT test library (learn threading)**

> "Write `libraries/MqttTestLibrary.py` — a class that connects to MQTT, subscribes, publishes, and waits for messages. **Before writing, teach me:**
> 1. Why does `paho-mqtt` use a background thread for `on_message`? What is a callback function?
> 2. What is a race condition? In this library, what happens if `Wait For Message` tries to read `_messages` at the exact same time `on_message` is writing to it?
> 3. What is `threading.Lock`? How does it prevent the race condition? (explain with an analogy: a single-key bathroom — only one person at a time)
> 4. Why does `Wait For Message` poll with `time.sleep(0.1)` instead of blocking? What is busy-waiting and is there a better alternative?
> Then write the library with detailed comments on the threading parts."

**Phase 3 — Schema validation (learn JSON Schema)**

> "Write `libraries/PayloadValidator.py` and two JSON schemas for telemetry and device status. **First explain:**
> 1. What is JSON Schema? Why validate with a schema instead of writing `if 'device_id' not in payload: raise Error`?
> 2. Walk me through a JSON schema file: what do `type`, `properties`, `required`, `enum`, and `format` mean?
> 3. What error does `jsonschema.validate()` raise on failure? How do I get a useful error message from it?
> 4. Why use GLOBAL library scope for this validator? (hint: schemas don't change between tests)
> Write both schemas and the library."

**Phase 4 — API test library + test suites**

> "Write `libraries/ApiTestLibrary.py` that wraps HTTP requests to a REST API. Then write 4 Robot Framework test suites (smoke, api_tests, mqtt_integration, payload_validation). **For the test suites, explain:**
> 1. How should I structure a test case? What makes a good test name? (it should read like a requirement)
> 2. What is Suite Setup vs Test Setup? When do I use each?
> 3. How do I use Robot Framework variables so the base_url and broker address can be changed in CI without editing the test files?
> 4. What does `[Documentation]` do in a test case? Who reads it?
> Write tests where each test name reads as a clear requirement, like 'Device List Should Return All Registered Devices'."

**Phase 5 — CI integration**

> "Write a GitHub Actions workflow that runs these tests. **Explain:**
> 1. How do GitHub Actions service containers work? How is the MQTT broker started alongside my tests?
> 2. What are 'artifacts' in GitHub Actions? Why upload the Robot Framework results folder?
> 3. What does the `robot` command return as an exit code? How does GitHub Actions know the tests failed?
> 4. How would I add a badge to my README showing test status? Where does the badge image come from?
> Write the workflow with comments."

---

## Updated Timeline Summary

| # | Project | Focus Area | Difficulty |
|---|---------|-----------|------------|
| 1 | DevOps Pipeline Dashboard | Full-stack backend project | Medium |
| 2 | Cloud Infrastructure Monitor | Azure, Terraform, monitoring | Medium |
| 3 | AI-Powered Log Analyzer | AI/LLM, testing, packaging | Medium |
| 4 | IoT Sensor Simulator & Platform | IoT, microservices, Node.js | Hard |
| 5 | Self-Service Deployment Platform | Everything combined | Hard |
| 6 | Real-Time Data Pipeline | MQTT, PostgreSQL, Grafana, Docker | Beginner-friendly |
| 7 | CI/CD Pipeline From Scratch | Jenkins/GH Actions, testing, Docker | Beginner-friendly |
| 8 | Infrastructure as Code | Terraform, Azure, networking | Beginner-friendly |
| 9 | Production-Ready API Template | FastAPI, Docker, Redis, Nginx | Beginner-friendly |
| 10 | Server Automation Playbooks | Ansible, Linux, security | Beginner-friendly |
| 11 | Test Automation Framework | Robot Framework, Python, CI | Beginner-friendly |

### Technology Coverage Matrix

| Technology | Covered By Projects |
|---|---|
| Python | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 |
| FastAPI | 1, 5, 7, 9 |
| PostgreSQL | 6, 9 |
| Redis | 9 |
| MongoDB | 1, 4 |
| Node.js / Express | 4 |
| Docker / Compose | 1, 4, 5, 6, 7, 9, 10 |
| Jenkins | 1, 5, 7 |
| Ansible / Vault | 4, 5, 7, 10 |
| Terraform / HCL | 2, 8 |
| Azure / IoT Hub | 2, 4, 8 |
| MQTT / Mosquitto | 4, 6, 11 |
| Grafana | 2, 6 |
| Robot Framework | 3, 5, 7, 11 |
| pytest | 1, 3, 7, 9 |
| Nginx | 7, 9 |
| Bash / Shell | 2, 7, 8, 10 |
| Linux / UFW | 10 |
| Git / GitHub Actions | 2, 3, 8, 9, 11 |
| Jinja2 | 10 |
| AI / LLM | 3, 5 |

### Recommended Learning Path

**Start with Projects 6–11** — they're designed as learning exercises with built-in explanations. Each one teaches you a core area of your stack. Once you're comfortable, Projects 1–5 combine everything into bigger portfolio pieces.

**Phase 1 — Foundations (start here)**
1. **Project 9** (API Template) — Learn FastAPI, Docker, caching, reverse proxies. Reuse this template for everything else.
2. **Project 6** (Data Pipeline) — Learn MQTT, time-series DB, Grafana. Builds on Docker knowledge from Project 9.
3. **Project 10** (Server Automation) — Learn Ansible, Linux security, secrets. Independent of the others.

**Phase 2 — Level up**
4. **Project 8** (Infrastructure as Code) — Learn Terraform, Azure, networking. Needs Azure account.
5. **Project 11** (Test Automation) — Learn Robot Framework, threading, CI. Good after you have an app to test.
6. **Project 7** (CI/CD Pipeline) — Learn Jenkins, full pipeline, deployment gates. Ties together testing + Docker + Ansible.

**Phase 3 — Big projects**
7. Projects 1–5 in the original order — these combine everything you learned into showcase pieces.
