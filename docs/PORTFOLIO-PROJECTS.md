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

# Blog-Aligned Projects — Build What You Write About

## Why These Projects?

The 5 projects above are standalone portfolio pieces. The 6 projects below are **companion repos for each blog post** on the site. Every blog article claims you built something — these projects are the proof. Each one maps 1:1 to a blog post URL and covers the exact technologies discussed in that article.

---

## Project 6: MQTT Telemetry Pipeline (Blog: mqtt-grafana)

**Blog post:** `blog/mqtt-grafana.html`
**Repo name:** `mqtt-telemetry-pipeline`

### What You Build
A production-style pipeline: simulated IoT sensors → Mosquitto MQTT broker → Python subscriber → PostgreSQL → Grafana dashboard. Everything runs in Docker Compose.

### Tech Coverage
Python, paho-mqtt, Mosquitto, PostgreSQL, psycopg2, Grafana, Docker Compose, SQL

### Folder Structure
```
mqtt-telemetry-pipeline/
├── docker-compose.yml
├── mosquitto/
│   └── mosquitto.conf
├── subscriber/
│   ├── main.py                # MQTT subscriber → PostgreSQL
│   ├── db.py                  # Connection pool, insert logic
│   ├── requirements.txt
│   └── Dockerfile
├── simulator/
│   ├── sensor.py              # Generates fake telemetry
│   ├── requirements.txt
│   └── Dockerfile
├── grafana/
│   └── provisioning/
│       ├── datasources/
│       │   └── postgres.yml   # Auto-configure PG datasource
│       └── dashboards/
│           ├── dashboard.yml
│           └── telemetry.json # Pre-built dashboard
├── sql/
│   └── init.sql               # Schema + indexes
├── .env.example
└── README.md
```

### Step-by-Step Prompts

**Phase 1 — Schema & subscriber**

> "I'm building an MQTT telemetry pipeline. Write `sql/init.sql` with a `telemetry` table: columns `id BIGSERIAL`, `device_id VARCHAR(64)`, `metric VARCHAR(32)`, `value DOUBLE PRECISION`, `ts TIMESTAMPTZ DEFAULT NOW()`. Add indexes on `(ts DESC)` and `(device_id, ts DESC)`. Add a comment explaining why the composite index matters."

> "Write `subscriber/db.py` using psycopg2 with a connection pool (`psycopg2.pool.ThreadedConnectionPool`, min=2, max=10). Two functions: `init_pool(dsn)` and `insert_telemetry(device_id, metric, value)`. The insert function should get a connection from the pool, execute the INSERT, commit, and return the connection to the pool. Include error handling that returns the connection on failure too."

> "Write `subscriber/main.py` — a Python MQTT subscriber using paho-mqtt. It should: connect to broker (host/port/user/pass from env vars), subscribe to `devices/+/telemetry` with QoS 1, parse JSON payloads with keys `device_id`, `type`, `value`, and call `insert_telemetry()` from db.py. Use `loop_forever()`. Log connection events and errors."

**Phase 2 — Simulator**

> "Write `simulator/sensor.py` — a Python script that simulates 5 IoT sensors publishing to MQTT. Each sensor has a device_id (sensor-001 through sensor-005) and publishes temperature, humidity, or vibration. Temperature should drift between 18-35°C with Gaussian noise (std=0.5). Publish every 2 seconds per sensor using paho-mqtt to topic `devices/{device_id}/telemetry`. Read broker host/port/credentials from env vars."

**Phase 3 — Docker Compose**

> "Write `docker-compose.yml` with these services:
> - `mqtt`: eclipse-mosquitto:2, port 1883, mounts `./mosquitto/mosquitto.conf`, with authentication
> - `db`: postgres:16-alpine, with env vars from `.env`, a named volume `pgdata`, health check using `pg_isready`, mounts `./sql/init.sql` to `/docker-entrypoint-initdb.d/`
> - `subscriber`: builds from `./subscriber`, depends on `db` (service_healthy) and `mqtt`, env vars for DB and MQTT
> - `simulator`: builds from `./simulator`, depends on `mqtt`, env vars for MQTT
> - `grafana`: grafana/grafana-oss:latest, port 3000, mounts `./grafana/provisioning`, depends on `db`
> All services on a shared `backend` network. Include `.env.example` with all required variables."

> "Write `mosquitto/mosquitto.conf` with: listener 1883, `allow_anonymous false`, `password_file /mosquitto/config/passwd`. Add a comment in the README explaining how to generate the password file with `mosquitto_passwd`."

**Phase 4 — Grafana dashboard**

> "Write `grafana/provisioning/datasources/postgres.yml` that auto-configures a PostgreSQL datasource called 'Telemetry DB' pointing to host `db`, port 5432, using env vars for user/pass/dbname."

> "Write `grafana/provisioning/dashboards/telemetry.json` — a Grafana dashboard JSON with 3 panels:
> 1. Time-series panel: temperature over time (last 6 hours), one line per device_id
> 2. Stat panel: current average temperature across all devices
> 3. Table panel: latest 20 telemetry readings
> All panels query the PostgreSQL datasource. Use the provisioned datasource name."

**Phase 5 — README**

> "Write a README.md for this project. Include: what it does (1 paragraph), architecture diagram (ASCII), tech stack table, prerequisites (Docker, Docker Compose), quick start (`docker compose up`), accessing Grafana at localhost:3000, screenshot placeholder, and a section explaining the design decisions (connection pooling, QoS 1, composite indexes, table partitioning for scale). Link back to the blog post at `https://fahid-khan.github.io/blog/mqtt-grafana.html`."

---

## Project 7: Jenkins IoT Pipeline (Blog: jenkins-iot-pipeline)

**Blog post:** `blog/jenkins-iot-pipeline.html`
**Repo name:** `jenkins-iot-pipeline`

### What You Build
A Jenkins CI/CD pipeline for a sample Python IoT backend — lint with ruff, unit tests with pytest, integration tests with Robot Framework (using a custom Python library), Docker image build/push, and staged deployment with manual approval gate.

### Tech Coverage
Jenkins, Jenkinsfile, Docker, pytest, ruff, Robot Framework, Python, Ansible, Slack webhooks

### Folder Structure
```
jenkins-iot-pipeline/
├── Jenkinsfile
├── Dockerfile
├── requirements.txt
├── src/
│   ├── app.py                 # Minimal FastAPI app (device API)
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
│           └── IoTPlatformLibrary.py
├── ansible/
│   ├── deploy.yml
│   ├── inventory/
│   │   ├── staging.yml
│   │   └── production.yml
│   └── roles/
│       └── docker-deploy/
│           └── tasks/main.yml
├── scripts/
│   └── notify_slack.sh
└── README.md
```

### Step-by-Step Prompts

**Phase 1 — Sample app to deploy**

> "I'm building a CI/CD demo project. Write a minimal FastAPI app with two route files:
> - `routes/devices.py`: GET /api/devices (returns hardcoded list of 3 devices with id, name, status), GET /api/devices/{id}
> - `routes/telemetry.py`: POST /api/telemetry (accepts JSON with device_id, metric, value — validates with Pydantic, returns 201), GET /api/telemetry (returns last 10 entries from an in-memory list)
> Keep it simple — this app exists just to have something real to build, test, and deploy."

> "Write a multi-stage Dockerfile for this FastAPI app. Stage 1: install dependencies from requirements.txt with `--no-cache-dir`. Stage 2: copy app code, create non-root user `appuser`, expose 8000, run with uvicorn. Here's my requirements.txt: [paste]."

**Phase 2 — Tests**

> "Write pytest unit tests for `routes/devices.py` and `routes/telemetry.py` using FastAPI's TestClient. Test: GET /api/devices returns 200 with a list, GET /api/devices/unknown returns 404, POST /api/telemetry with valid JSON returns 201, POST /api/telemetry with missing fields returns 422. Output JUnit XML to `report.xml`."

> "Write a custom Robot Framework library `IoTPlatformLibrary.py` with these keywords:
> - `Get Device List` — calls GET /api/devices, returns the JSON list
> - `Post Telemetry` (device_id, metric, value) — calls POST /api/telemetry
> - `Device Count Should Be` (expected) — asserts length of device list
> - `Response Status Should Be` (response, expected_code) — validates status code
> Use the `requests` library. Accept a `base_url` constructor argument. Set `ROBOT_LIBRARY_SCOPE = 'TEST SUITE'`."

> "Write two Robot Framework test suites:
> - `smoke_test.robot`: verify the API is reachable, device list returns 3 devices, posting telemetry returns 201
> - `device_api.robot`: test each device endpoint, test invalid device returns 404, test telemetry validation rejects bad payloads
> Use the IoTPlatformLibrary. Configure the base_url as a Robot variable so it works in staging and production."

**Phase 3 — Jenkinsfile**

> "Write a declarative Jenkinsfile with these stages:
> 1. Lint — install and run `ruff check src/`
> 2. Unit Tests — run `pytest tests/unit/ --junitxml=report.xml`, archive results with `junit`
> 3. Robot Framework — run `robot --outputdir results/ tests/robot/`, archive with the Robot Framework Jenkins plugin, set 95% pass threshold
> 4. Build & Push — build Docker image tagged with `BUILD_NUMBER`, push to registry (use env vars `REGISTRY` and `IMAGE`)
> 5. Deploy to Staging — run `ansible-playbook ansible/deploy.yml -i ansible/inventory/staging.yml -e image_tag=${BUILD_NUMBER}`
> 6. Approval — `input` step with message 'Deploy to production?'
> 7. Deploy to Production — same ansible command with production inventory
> Add a `post { failure }` block that calls `scripts/notify_slack.sh`."

**Phase 4 — Ansible deployment**

> "Write an Ansible playbook `ansible/deploy.yml` that:
> 1. Connects to hosts in the `backend` group
> 2. Pulls the Docker image `{{ registry }}/{{ image }}:{{ image_tag }}`
> 3. Stops the existing container if running
> 4. Starts a new container on port 8000 with `--restart unless-stopped`
> 5. Waits 10 seconds then runs a health check (curl localhost:8000/health)
> 6. Fails the playbook if the health check returns non-200
> Use variables for registry, image, image_tag passed via `-e` on the command line."

> "Write `scripts/notify_slack.sh` — a Bash script that sends a Slack notification. Accept `$SLACK_WEBHOOK` env var. Post a JSON payload with the message 'Pipeline #$BUILD_NUMBER failed for $JOB_NAME'. Include error handling — if curl fails, log to stderr but don't exit non-zero (don't break the pipeline over a notification failure)."

---

## Project 8: Terraform Azure Infrastructure (Blog: terraform-azure)

**Blog post:** `blog/terraform-azure.html`
**Repo name:** `terraform-azure-iot`

### What You Build
A real Terraform project that provisions Azure infrastructure: resource group, IoT Hub with storage routes, VNet with subnets and NSGs, remote state in Azure Storage with locking. Structured with reusable modules and separate staging/production environments.

### Tech Coverage
Terraform, HCL, Azure, Azure IoT Hub, Azure Storage, networking, remote state, CI/CD

### Folder Structure
```
terraform-azure-iot/
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
│   │   ├── variables.tf
│   │   └── terraform.tfvars
│   └── production/
│       ├── main.tf
│       ├── backend.tf
│       ├── variables.tf
│       └── terraform.tfvars
├── scripts/
│   ├── bootstrap-state.sh     # One-time: create storage for remote state
│   └── plan-and-apply.sh      # CI helper script
├── .github/
│   └── workflows/
│       └── terraform.yml      # GitHub Actions: plan on PR, apply on merge
├── .gitignore
└── README.md
```

### Step-by-Step Prompts

**Phase 1 — Modules**

> "Write a Terraform module at `modules/networking/` that creates:
> - An Azure resource group
> - A VNet with address space `10.0.0.0/16`
> - Two subnets: `backend` (10.0.1.0/24) and `iot` (10.0.2.0/24)
> - An NSG attached to the backend subnet with rules: allow SSH (22) from a configurable CIDR, allow HTTPS (443) from anywhere, allow MQTT (1883) from the iot subnet only, deny all other inbound
> Variables: `resource_group_name`, `location`, `allowed_ssh_cidr`, `tags`. Outputs: `resource_group_name`, `vnet_id`, `backend_subnet_id`, `iot_subnet_id`."

> "Write a Terraform module at `modules/iot/` that creates:
> - An Azure IoT Hub with configurable SKU (name and capacity)
> - A storage container endpoint for archiving device messages as JSON
> - A route that sends all DeviceMessages to that storage endpoint
> - `lifecycle { prevent_destroy = true }` on the IoT Hub
> Variables: `iot_hub_name`, `resource_group_name`, `location`, `sku_name` (default S1), `sku_capacity` (default 1), `storage_connection_string`, `tags`. Outputs: `iot_hub_name`, `iot_hub_hostname`, `event_hub_endpoint`."

> "Write a Terraform module at `modules/storage/` that creates:
> - An Azure Storage Account (LRS, Hot tier)
> - A blob container called `telemetry`
> - `lifecycle { prevent_destroy = true }` on the storage account
> Variables: `storage_account_name`, `resource_group_name`, `location`, `tags`. Outputs: `connection_string`, `primary_access_key`, `storage_account_id`."

**Phase 2 — Environments**

> "Write `environments/staging/main.tf` that calls all three modules with staging-appropriate values: S1 IoT Hub with capacity 1, small VNet, tags `{ environment = 'staging', managed-by = 'terraform', project = 'iot-platform' }`. Pass the storage connection string from the storage module output into the iot module."

> "Write `environments/staging/backend.tf` with an `azurerm` backend pointing to a storage account for remote state. Resource group: `rg-terraform-state`, storage account: `stterraformstate`, container: `tfstate`, key: `staging.tfstate`."

> "Write `environments/production/main.tf` — same module calls as staging but with: S2 IoT Hub with capacity 4, production tags. Show how the same modules serve both environments with different tfvars."

**Phase 3 — Bootstrap & CI**

> "Write `scripts/bootstrap-state.sh` — a Bash script that creates the Azure Storage account for Terraform remote state. It should: create the resource group, create the storage account with blob versioning enabled, create the `tfstate` container, and output the storage account name. Use `az` CLI commands. Add comments explaining this is a one-time manual step."

> "Write a GitHub Actions workflow `.github/workflows/terraform.yml` that:
> - On pull_request: runs `terraform init`, `terraform validate`, `terraform plan` for the staging environment, posts the plan output as a PR comment
> - On push to main: runs `terraform init`, `terraform plan -out=tfplan`, `terraform apply tfplan` for staging
> Use OIDC authentication with Azure (federated credentials). Set up job permissions for `id-token: write`. Store the Azure subscription ID, tenant ID, and client ID as GitHub secrets."

**Phase 4 — README**

> "Write a README.md with: project description (1 paragraph), module diagram (show how networking/storage/iot modules compose), prerequisites (Terraform 1.5+, Azure CLI, Azure subscription), setup instructions (bootstrap state, terraform init/plan/apply), environment differences (staging vs production table), CI/CD explanation, and a link to the blog post at `https://fahid-khan.github.io/blog/terraform-azure.html`. Include a gotchas section covering: state drift detection, prevent_destroy, tagging convention."

---

## Project 9: FastAPI Docker Compose Stack (Blog: docker-compose-fastapi)

**Blog post:** `blog/docker-compose-fastapi.html`
**Repo name:** `fastapi-compose-stack`

### What You Build
A production-ready Docker Compose setup: multi-stage FastAPI Dockerfile, PostgreSQL with health checks, Redis caching layer, Nginx reverse proxy with static file serving. A template you can fork for any FastAPI project.

### Tech Coverage
Docker, Docker Compose, FastAPI, Uvicorn, PostgreSQL, Redis, Nginx, Python, multi-stage builds

### Folder Structure
```
fastapi-compose-stack/
├── docker-compose.yml
├── .env.example
├── app/
│   ├── main.py
│   ├── routes/
│   │   ├── items.py
│   │   └── health.py
│   ├── services/
│   │   ├── cache.py           # Redis helpers
│   │   └── database.py        # SQLAlchemy setup
│   ├── models.py
│   ├── requirements.txt
│   └── Dockerfile
├── nginx/
│   ├── nginx.conf
│   └── certs/                 # Self-signed for local dev
├── static/
│   └── index.html             # Simple landing page
├── tests/
│   ├── test_items.py
│   └── test_health.py
└── README.md
```

### Step-by-Step Prompts

**Phase 1 — App + Dockerfile**

> "Write a FastAPI app with two route files:
> - `routes/health.py`: GET /health returns `{ 'status': 'ok', 'db': true, 'cache': true }` — actually ping PostgreSQL and Redis, return false for either if unreachable
> - `routes/items.py`: CRUD endpoints for a simple Item model (id, name, description, created_at). GET /api/items uses Redis caching with 5-minute TTL. POST/PUT/DELETE invalidate the cache.
> Use SQLAlchemy async with PostgreSQL. Use `redis.Redis` for caching. Read all connection strings from environment variables."

> "Write `services/database.py` with async SQLAlchemy engine and session setup. Read `DATABASE_URL` from env. Include a `get_db` dependency and an `init_db` function that creates tables on startup."

> "Write `services/cache.py` with Redis connection helpers. Functions: `get_cached(key)`, `set_cached(key, value, ttl=300)`, `invalidate(key)`. Read `REDIS_URL` from env. Decode responses. Handle `ConnectionError` gracefully — return None on cache miss if Redis is down, don't crash the app."

> "Write a multi-stage Dockerfile:
> - Stage 1 (`builder`): python:3.12-slim, install dependencies from requirements.txt with `--no-cache-dir --prefix=/install`
> - Stage 2: python:3.12-slim, copy installed packages from builder, copy app code, create non-root user `appuser`, switch to it, expose 8000, CMD uvicorn
> Keep it under 30 lines."

**Phase 2 — Docker Compose**

> "Write `docker-compose.yml` with 4 services:
> - `app`: builds from `./app`, env_file `.env`, depends on db (service_healthy) and redis (service_healthy), network: backend
> - `db`: postgres:16-alpine, env vars for POSTGRES_DB/USER/PASSWORD from `.env`, named volume `pgdata`, health check with `pg_isready`, network: backend
> - `redis`: redis:7-alpine, `redis-server --requirepass ${REDIS_PASS}`, health check with `redis-cli -a ${REDIS_PASS} ping`, network: backend
> - `nginx`: nginx:alpine, ports 80:80, mounts `./nginx/nginx.conf` read-only, mounts `./static` to `/var/www/static` read-only, depends on app, network: backend
> Named volume `pgdata`. Network `backend`."

**Phase 3 — Nginx**

> "Write `nginx/nginx.conf` with an upstream block pointing to `app:8000`. Server block on port 80:
> - `location /` proxies to the upstream with headers: Host, X-Real-IP, X-Forwarded-For, X-Forwarded-Proto
> - `location /static/` serves files from `/var/www/static/` with 30-day cache and `Cache-Control: public, immutable`
> - `location /health` proxies to the upstream (no caching)
> Include `client_max_body_size 10m` and `proxy_read_timeout 30s`."

**Phase 4 — Tests + README**

> "Write pytest tests using FastAPI TestClient:
> - `test_health.py`: test /health returns 200 with status ok
> - `test_items.py`: test CRUD lifecycle — create item, get item, list items, update item, delete item. Each test asserts correct status code and response body.
> Use fixtures for the test client. Override the database dependency to use an in-memory SQLite for tests."

> "Write a README.md: what it does, architecture diagram (Nginx → FastAPI → PostgreSQL + Redis), tech stack, quick start (`cp .env.example .env && docker compose up`), accessing the API at localhost/api/items, health check at localhost/health, design decisions (why multi-stage, why non-root user, why health checks with depends_on conditions, why named volumes, why never put secrets in compose files). Link to blog post."

---

## Project 10: Ansible Server Automation (Blog: ansible-server-automation)

**Blog post:** `blog/ansible-server-automation.html`
**Repo name:** `ansible-server-playbooks`

### What You Build
A set of Ansible playbooks and roles for provisioning Ubuntu servers and deploying Dockerised applications. Includes security hardening, Jinja2 templated configs, Ansible Vault for secrets, and a reusable role structure.

### Tech Coverage
Ansible, Ansible Vault, Jinja2 templates, Linux, UFW, fail2ban, SSH hardening, Docker, Docker Compose, Bash

### Folder Structure
```
ansible-server-playbooks/
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
│       ├── tasks/main.yml
│       └── templates/
│           └── prometheus.yml.j2
├── playbooks/
│   ├── provision.yml
│   ├── deploy.yml
│   └── monitoring.yml
├── scripts/
│   └── vault-password.sh      # Retrieves vault pass from env
└── README.md
```

### Step-by-Step Prompts

**Phase 1 — Common role (security hardening)**

> "Write the Ansible role `roles/common/tasks/main.yml` that:
> 1. Updates apt cache (cache_valid_time: 3600)
> 2. Installs: curl, git, ufw, fail2ban, unattended-upgrades
> 3. Configures UFW: allow ports 22, 80, 443 (tcp), enable UFW with default deny
> 4. Disables root SSH login via lineinfile on `/etc/ssh/sshd_config`
> 5. Sets `PasswordAuthentication no` in sshd_config
> 6. Notifies a handler to restart sshd
> Write the handler in `roles/common/handlers/main.yml`. All tasks should be idempotent."

**Phase 2 — Docker role**

> "Write `roles/docker/tasks/main.yml` that installs Docker CE on Ubuntu:
> 1. Install prerequisites: apt-transport-https, ca-certificates, curl, gnupg
> 2. Add Docker's official GPG key
> 3. Add Docker apt repository
> 4. Install docker-ce, docker-ce-cli, containerd.io, docker-compose-plugin
> 5. Start and enable the docker service
> 6. Add the `deploy` user to the `docker` group
> Use the `apt_key`, `apt_repository`, and `apt` modules. Make it idempotent."

**Phase 3 — App deployment role**

> "Write `roles/app-deploy/tasks/main.yml` that:
> 1. Creates `/opt/app` directory owned by `deploy` user, mode 0755
> 2. Templates `docker-compose.yml.j2` to `/opt/app/docker-compose.yml` with mode 0600
> 3. Runs `docker compose pull` in `/opt/app`
> 4. Runs `docker compose up -d --remove-orphans` in `/opt/app`
> 5. Waits 15 seconds for services to start
> 6. Runs a health check: `curl -sf http://localhost:8000/health` — fails the playbook if it returns non-zero
> Write the Jinja2 template `docker-compose.yml.j2` that uses variables: `{{ docker_registry }}`, `{{ image_name }}`, `{{ image_tag }}`, `{{ db_password }}`, `{{ redis_password }}`."

**Phase 4 — Playbooks, Vault, inventory**

> "Write `playbooks/provision.yml` that runs the `common` and `docker` roles on hosts in the `backend` group with `become: true`."

> "Write `playbooks/deploy.yml` that runs the `app-deploy` role on `backend` hosts. Accept `image_tag` as an extra variable."

> "Write `inventory/staging.yml` with a `backend` group containing one host `staging-server` with `ansible_host`, `ansible_user: deploy`, `ansible_ssh_private_key_file`. Write `group_vars/all.yml` with shared variables: `docker_registry`, `image_name`, `app_port: 8000`. Explain in a comment that `group_vars/production.yml` should be encrypted with Ansible Vault."

> "Write the README.md with: what these playbooks do, role descriptions, prerequisites (Ansible 2.14+, SSH access to target servers), usage examples (`ansible-playbook playbooks/provision.yml -i inventory/staging.yml`), Vault usage (encrypt, decrypt, run with `--ask-vault-pass` and `--vault-password-file`), a section on `--check` dry-run mode, and `ansible-lint` usage. Link to the blog post."

---

## Project 11: Robot Framework Test Suite (Blog: robot-framework-python-libraries)

**Blog post:** `blog/robot-framework-python-libraries.html`
**Repo name:** `robot-framework-iot-tests`

### What You Build
A Robot Framework test suite with custom Python libraries for testing MQTT message flows, REST APIs, and JSON payload validation. Includes a library for MQTT (paho-mqtt), a payload validator (jsonschema), and example test suites that exercise an IoT API endpoint.

### Tech Coverage
Robot Framework, Python, paho-mqtt, jsonschema, MQTT, REST API testing, test automation

### Folder Structure
```
robot-framework-iot-tests/
├── libraries/
│   ├── MqttTestLibrary.py
│   ├── PayloadValidator.py
│   └── DeviceApiLibrary.py
├── resources/
│   ├── common.resource
│   └── schemas/
│       ├── telemetry.json
│       └── device_status.json
├── suites/
│   ├── mqtt_integration.robot
│   ├── device_api.robot
│   ├── payload_validation.robot
│   └── smoke.robot
├── results/                   # .gitignore'd
├── requirements.txt
├── .github/
│   └── workflows/
│       └── tests.yml
└── README.md
```

### Step-by-Step Prompts

**Phase 1 — MQTT library**

> "Write `libraries/MqttTestLibrary.py` — a Robot Framework library for MQTT testing. Class attributes: `ROBOT_LIBRARY_SCOPE = 'TEST SUITE'`. Constructor takes `broker` (default localhost) and `port` (default 1883). Keywords:
> - `Connect To Broker` (client_id) — connects with paho-mqtt, starts loop
> - `Disconnect From Broker` — stops loop, disconnects
> - `Subscribe To Topic` (topic, qos=1)
> - `Publish Message` (topic, payload, qos=1) — accepts dict or string, converts to JSON
> - `Wait For Message` (topic, timeout=10) — polls with 0.1s sleep, returns payload string, raises AssertionError on timeout
> - `Message Payload Should Contain` (payload, key, expected) — parses JSON, compares value
> Use a `threading.Lock` to protect the `_messages` dict updated by `on_message` callback."

**Phase 2 — Payload validator**

> "Write `libraries/PayloadValidator.py` — a Robot Framework library with `ROBOT_LIBRARY_SCOPE = 'GLOBAL'`. Keywords:
> - `Load Schema` (name, schema_path) — loads a JSON schema from file, stores in a dict
> - `Payload Should Match Schema` (payload, schema_name) — validates using jsonschema.validate, raises AssertionError with the validation error message if it fails
> Write two JSON schema files in `resources/schemas/`:
> - `telemetry.json` — requires: device_id (string), type (string, enum: temperature/humidity/vibration), value (number), timestamp (string, format: date-time)
> - `device_status.json` — requires: device_id (string), status (string, enum: online/offline), last_seen (string, format: date-time)"

**Phase 3 — API library + test suites**

> "Write `libraries/DeviceApiLibrary.py` — a Robot Framework library for testing a REST API. Constructor takes `base_url`. `ROBOT_LIBRARY_SCOPE = 'TEST SUITE'`. Keywords:
> - `Get Devices` — GET /api/devices, returns JSON
> - `Get Device` (device_id) — GET /api/devices/{device_id}
> - `Post Telemetry` (device_id, metric, value) — POST /api/telemetry with JSON body
> - `Response Status Should Be` (response, expected) — asserts status code
> - `Response Should Contain Key` (response_json, key) — asserts key exists
> Use the `requests` library."

> "Write 4 Robot Framework test suites:
> 1. `smoke.robot` — import DeviceApiLibrary, verify API is reachable (GET /health returns 200), device list returns data
> 2. `device_api.robot` — test full CRUD: get list, get single device, post telemetry, verify posted data appears
> 3. `mqtt_integration.robot` — import MqttTestLibrary, connect to broker, subscribe to topic, publish message, wait for it, validate payload contains expected keys
> 4. `payload_validation.robot` — import PayloadValidator, load schemas, test valid telemetry passes, test invalid telemetry (missing field, wrong type) fails
> Use Suite Setup/Teardown for connections. Use variables for base_url, broker, port so CI can override them."

**Phase 4 — CI + README**

> "Write a GitHub Actions workflow `.github/workflows/tests.yml` that:
> - Starts a Mosquitto MQTT broker as a service container on port 1883
> - Installs Python 3.12, pip install requirements.txt
> - Runs `robot --outputdir results/ suites/`
> - Uploads results/ as an artifact
> - Fails the workflow if any test fails"

> "Write README.md: what this project does, how the custom libraries work (library scope explanation with examples), how to run locally (`robot suites/`), how to add new test keywords, CI badge, link to blog post."

---

## Updated Timeline Summary

| # | Project | Type | Primary Blog Post |
|---|---------|------|-------------------|
| 1 | DevOps Pipeline Dashboard | Standalone | — |
| 2 | Cloud Infrastructure Monitor | Standalone | — |
| 3 | AI-Powered Log Analyzer | Standalone | — |
| 4 | IoT Sensor Simulator & Platform | Standalone | — |
| 5 | Self-Service Deployment Platform | Standalone | — |
| 6 | MQTT Telemetry Pipeline | Blog companion | mqtt-grafana |
| 7 | Jenkins IoT Pipeline | Blog companion | jenkins-iot-pipeline |
| 8 | Terraform Azure Infrastructure | Blog companion | terraform-azure |
| 9 | FastAPI Docker Compose Stack | Blog companion | docker-compose-fastapi |
| 10 | Ansible Server Automation | Blog companion | ansible-server-automation |
| 11 | Robot Framework Test Suite | Blog companion | robot-framework-python-libraries |

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

### Recommended Build Order

**Start with blog companions (Projects 6–11)** — they're smaller, directly back your blog posts, and give you 6 public repos fast. Then tackle the standalone projects (1–5) for deeper portfolio pieces.

1. **Project 9** (FastAPI Compose) — simplest, reusable template, 1–2 days
2. **Project 6** (MQTT Pipeline) — builds on Project 9 patterns, 2–3 days
3. **Project 11** (Robot Framework) — standalone test suite, 2 days
4. **Project 10** (Ansible Playbooks) — no dependencies, 2 days
5. **Project 7** (Jenkins Pipeline) — uses app from Project 9, 3 days
6. **Project 8** (Terraform Azure) — needs Azure subscription, 3 days
7. Then Projects 1–5 in original order
