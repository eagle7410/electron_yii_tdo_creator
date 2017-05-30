<?php

namespace {{= it.ns }};

interface {{= it.className }}
{
{{~ it.props :prop}}
    public function get{{= prop.substring(0, 1).toUpperCase() + prop.substring(1) }}();
{{~}}
}
