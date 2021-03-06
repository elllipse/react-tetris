const getBlankState = () =>  [
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0]
      ];

const elements = {
    I: [
        [
            [0],
            [0],
            [0],
            [0]
        ],
        [
            [-1,0,1,2]
        ]
    ],
    L: [
        [
            [-1,0],
               [0],
               [0],
        ],
        [
                 [1],
            [-1,0,1]
        ],
        [
            [0],
            [0],
            [0,1],
        ],
        [
            [-1,0,1],
            [-1],
        ]
    ],
    J: [
        [
            [-1,0,1],
                 [1],
        ],
        [
            [0],
            [0],
         [-1,0],
        ],
        [
            [-1],
            [-1,0,1]
        ],
        [
            [0,1],
            [0],
            [0],
        ]
    ],
    Z: [
        [
            [-1,0],
                [0,1]
        ],
        [
               [0],
            [-1,0],
            [-1],
        ]
    ],
    S: [
        [
               [0,1],
            [-1,0]
        ],
        [
            [0],
            [0,1],
              [1],
        ]
    ],
    T: [
        [
            [-1,0,1],
               [0]
        ],
        [
               [0],
            [-1,0],
               [0]
        ],
        [
               [0],
            [-1,0,1]
        ],
        [
               [0],
               [0,1],
               [0]
        ],
    ],
    O: [
        [
            [-1,0],
            [-1,0]
        ]
    ]
};

module.exports =  {
  elements,
  getBlankState  
}