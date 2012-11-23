#!/bin/sh
telnet localhost 3333 <<EOF
{"command":"shutdown"}
EOF
