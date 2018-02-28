define({ "api": [
  {
    "type": "get",
    "url": "/issues",
    "title": "List of all users",
    "name": "GetIssue",
    "group": "Issue",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Unique identifier of the issue</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>First name of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "lastName",
            "description": "<p>Last name of the user</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/api.issue.js",
    "groupTitle": "Issue"
  },
  {
    "type": "post",
    "url": "/users",
    "title": "Create a new user",
    "name": "CreateUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>Firstname of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lastName",
            "description": "<p>Firstname of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"citizen\"",
              "\"manager\""
            ],
            "optional": false,
            "field": "role",
            "description": "<p>Role of the user</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>New user created</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": {\n        \"_id\": \"5a8ec4096232180d984b6eb9\",\n        \"firstName\": \"John\",\n        \"lastName\": \"Doe\",\n        \"role\": \"manager\",\n        \"createdAt\": \"2018-02-22T13:22:17.749Z\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.user.js",
    "groupTitle": "User",
    "error": {
      "fields": {
        "522": [
          {
            "group": "522",
            "type": "Object",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after 5 seconds.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "patch",
    "url": "/users/:userId",
    "title": "Edit a user",
    "name": "EditUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "firstName",
            "description": "<p>Firstname of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "lastName",
            "description": "<p>Firstname of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"citizen\"",
              "\"manager\""
            ],
            "optional": true,
            "field": "role",
            "description": "<p>Role of the user</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>Updated user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": {\n        \"_id\": \"5a8ec4096232180d984b6eb9\",\n        \"firstName\": \"John\",\n        \"lastName\": \"Doe\",\n        \"role\": \"manager\",\n        \"createdAt\": \"2018-02-22T13:22:17.749Z\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "422": [
          {
            "group": "422",
            "type": "Object",
            "optional": false,
            "field": "NothingToUpdate",
            "description": "<p>Nothing to update. Please make a change.</p>"
          }
        ],
        "522": [
          {
            "group": "522",
            "type": "Object",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after 5 seconds.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n    \"error\": {\n        \"status\": 422,\n        \"message\": \"Nothing to update. Please make a change.\"\n    }\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.user.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/users/:userId",
    "title": "Get the user information",
    "name": "GetUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Unique identifier of the user</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>User object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": {\n        \"_id\": \"5a8ec4096232180d984b6eb9\",\n        \"firstName\": \"John\",\n        \"lastName\": \"Doe\",\n        \"role\": \"manager\",\n        \"createdAt\": \"2018-02-22T13:22:17.749Z\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.user.js",
    "groupTitle": "User",
    "error": {
      "fields": {
        "522": [
          {
            "group": "522",
            "type": "Object",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after 5 seconds.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/users",
    "title": "List all the user",
    "name": "GetUserList",
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>User object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": [\n        {\n            \"_id\": \"5a8ec4096232180d984b6eb9\",\n            \"firstName\": \"John\",\n            \"lastName\": \"Doe\",\n            \"role\": \"manager\",\n            \"createdAt\": \"2018-02-22T13:22:17.749Z\",\n            \"issuesCreatedCount\": 3\n        },\n        {...}\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.user.js",
    "groupTitle": "User",
    "error": {
      "fields": {
        "522": [
          {
            "group": "522",
            "type": "Object",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after 5 seconds.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        }
      ]
    }
  }
] });
