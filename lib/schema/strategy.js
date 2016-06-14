var common = require('./common');

module.exports = {
    "strategy": {
        "id": "/strategy",
        "type": "object",
        "properties": {
            "audience_segment_exclude_op": common.logical_and_or,
            "audience_segment_include_op": common.logical_and_or,
            "bid_aggressiveness": {
                "id": "/strategy/bid_aggressiveness",
                "type": "number"
            },
            "bid_price_is_media_only": {
                "id": "/strategy/bid_price_is_media_only",
                "type": "boolean"
            },
            "budget": {
                "id": "/strategy/budget",
                "type": "number"
            },
            "campaign_id": {
                "id": "/strategy/campaign_id",
                "type": "integer"
            },
            "currency_code": {
                "id": "/strategy/currency_code",
                "type": "string"
            },
            "description": {
                "id": "/strategy/description",
                "type": "string"
            },
            "effective_goal_value": common.currency_array,
            "end_date": {
                "id": "/strategy/end_date",
                "type": "string",
                "format": "datetimezone"
            },
            "feature_compatibility": {
                "id": "/strategy/feature_compatibility",
                "type": "string"
            },
            "frequency_amount": {
                "id": "/strategy/frequency_amount",
                "type": "integer"
            },
            "frequency_interval": {
                "id": "/strategy/frequency_interval",
                "enum": [
                    "hour",
                    "day",
                    "week",
                    "month",
                    "not-applicable"
                ],
                "default": "not-applicable"
            },
            "frequency_type": {
                "id": "/strategy/frequency_type",
                "enum": [
                    "even",
                    "asap",
                    "no-limit"
                ],
                "default": "no-limit"
            },
            "goal_type": {
                "id": "/strategy/goal_type",
                "enum": [
                    "spend",
                    "reach",
                    "cpc",
                    "cpe",
                    "cpa",
                    "roi"
                ],
                "default": "cpc"
            },
            "goal_value": common.currency_array,
            "impression_cap": {
                "id": "/strategy/impression_cap",
                "type": "integer"
            },
            "max_bid": common.currency_array,
            "media_type": {
                "id": "/strategy/media_type",
                "enum": [
                    "DISPLAY",
                    "VIDEO"
                ],
                "default": "DISPLAY"
            },
            "pacing_amount": common.currency_array,
            "pacing_interval": {
                "id": "/strategy/pacing_interval",
                "enum": [
                    "hour",
                    "day"
                ],
                "default": "day"
            },
            "pacing_type": {
                "id": "/strategy/pacing_type",
                "enum": [
                    "even",
                    "asap"
                ],
                "default": "even"
            },
            "pixel_target_expr": {
                "id": "/strategy/pixel_target_expr",
                "type": "string"
            },
            "run_on_all_exchanges": {
                "id": "/strategy/run_on_all_exchanges",
                "type": "boolean"
            },
            "run_on_all_pmp": {
                "id": "/strategy/run_on_all_pmp",
                "type": "boolean"
            },
            "run_on_display": {
                "id": "/strategy/run_on_display",
                "type": "boolean"
            },
            "run_on_mobile": {
                "id": "/strategy/run_on_mobile",
                "type": "boolean"
            },
            "run_on_streaming": {
                "id": "/strategy/run_on_streaming",
                "type": "boolean"
            },
            "site_restriction_transparent_urls": {
                "id": "/strategy/site_restriction_transparent_urls",
                "type": "boolean"
            },
            "site_selectiveness": {
                "id": "/strategy/site_selectiveness",
                "enum": [
                    "MATHSELECT_250",
                    "EXCLUDE_UGC",
                    "ALL",
                    "REDUCED"
                ],
                "default": "REDUCED"
            },
            "start_date": {
                "id": "/strategy/start_date",
                "type": "string",
                "format": "datetimezone"
            },
            "status": {
                "id": "/strategy/status",
                "type": "boolean"
            },
            "supply_type": {
                "id": "/strategy/supply_type",
                "enum": [
                    "RTB",
                    "RMX_API",
                    "T1_RMX"
                ],
                "default": "RTB"
            },
            "type": {
                "id": "/strategy/type",
                "enum": [
                    "REM",
                    "GBO",
                    "AUD"
                ],
                "default": "GBO"
            },
            "total_budget": common.currency_array,
            "use_campaign_end": {
                "id": "/strategy/use_campaign_end",
                "type": "boolean"
            },
            "use_campaign_start": {
                "id": "/strategy/use_campaign_start",
                "type": "boolean"
            },
            "use_mm_freq": {
                "id": "/strategy/use_mm_freq",
                "type": "boolean"
            },
            "use_optimization": {
                "id": "/strategy/use_optimization",
                "type": "boolean"
            },
            "created_on": {
                "id": "/strategy/created_on",
                "type": "string",
                "format": "datetimezone",
                "readonly": true
            },
            "updated_on": {
                "id": "/strategy/updated_on",
                "type": "string",
                "format": "datetimezone",
                "readonly": true
            }
        },
        "required": [
            "budget",
            "campaign_id",
            "goal_type",
            "goal_value",
            "max_bid",
            "name",
            "pacing_amount",
            "type"
        ]
    },
    "allOf": [
        common.entity,
        {
            "$ref": "#/strategy"
        }
    ]
};
