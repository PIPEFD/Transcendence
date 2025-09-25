<?php

function connectDatabase(): SQLite3
{
    return databaseConnection();
}
