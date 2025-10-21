<?php
header('Content-Type: text/plain');
echo "=== ALL HEADERS ===\n";
foreach (getallheaders() as $name => $value) {
    echo "$name: $value\n";
}
