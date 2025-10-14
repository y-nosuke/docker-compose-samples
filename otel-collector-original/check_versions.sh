#!/bin/bash

echo "OpenTelemetry Collector Components - Latest Versions"
echo "=================================================="

# Core components
echo "Core Components:"
echo "----------------"
echo "OTLP Receiver:"
go list -m -u go.opentelemetry.io/collector/receiver/otlpreceiver 2>/dev/null || echo "  Not available in current module"

echo "Filter Processor:"
go list -m -u go.opentelemetry.io/collector/processor/filterprocessor 2>/dev/null || echo "  Not available in current module"

echo "Debug Exporter:"
go list -m -u go.opentelemetry.io/collector/exporter/debugexporter 2>/dev/null || echo "  Not available in current module"

echo "Health Check Extension:"
go list -m -u go.opentelemetry.io/collector/extension/healthcheckextension 2>/dev/null || echo "  Not available in current module"

echo ""
echo "Contrib Components:"
echo "------------------"
echo "AWS EMF Exporter:"
curl -s https://proxy.golang.org/github.com/open-telemetry/opentelemetry-collector-contrib/exporter/awsemfexporter/@latest 2>/dev/null | jq -r '.Version' || echo "  Error fetching version"

echo "AWS X-Ray Exporter:"
curl -s https://proxy.golang.org/github.com/open-telemetry/opentelemetry-collector-contrib/exporter/awsxrayexporter/@latest 2>/dev/null | jq -r '.Version' || echo "  Error fetching version"

echo "Span Metrics Connector:"
curl -s https://proxy.golang.org/github.com/open-telemetry/opentelemetry-collector-contrib/connector/spanmetricsconnector/@latest 2>/dev/null | jq -r '.Version' || echo "  Error fetching version"

echo ""
echo "Repository Releases:"
echo "-------------------"
echo "Core Repository Latest:"
curl -s https://api.github.com/repos/open-telemetry/opentelemetry-collector/releases/latest 2>/dev/null | jq -r '.tag_name' || echo "  Error fetching release"

echo "Contrib Repository Latest:"
curl -s https://api.github.com/repos/open-telemetry/opentelemetry-collector-contrib/releases/latest 2>/dev/null | jq -r '.tag_name' || echo "  Error fetching release"
