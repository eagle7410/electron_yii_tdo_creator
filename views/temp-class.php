<?php

namespace {{= it.ns }};

class {{= it.className }}
{
{{~ it.props :prop}}
    private ${{= prop}};
{{~}}

    public function __constructor({{= it.props.map(function(p) {return '$' + p}).join(',') }})
    {
        {{~ it.props :prop}}$this->{{= prop}} = ${{= prop}};
        {{~}}
    }
{{~ it.props :prop}}
    public function get{{= prop.substring(0, 1).toUpperCase() + prop.substring(1) }}()
    {
        return $this->{{= prop}} = ${{= prop}};
    }
{{~}}
}
