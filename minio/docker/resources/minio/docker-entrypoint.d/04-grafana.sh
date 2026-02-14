#!/bin/sh
set -e

# tempo
mc mb --ignore-existing local/tempo
mc admin user add local tempo supersecret
mc admin policy attach local readwrite --user tempo
