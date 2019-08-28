# Snapshot report for `packages/compiler/src/common/print-styles.test.ts`

The actual snapshot is saved in `print-styles.test.ts.snap`.

Generated by [AVA](https://ava.li).

## should process basic style

> Snapshot 1

    `.button-36d38␊
    {␊
      color: red;␊
      background-color: red;␊
    }␊
    .button-36d38:hover␊
    {␊
      color: green;␊
    }␊
    .button-36d38--inverse .button-36d38__something␊
    {␊
      color: green;␊
      font-size: var(--my-font-size__hash);␊
      padding-top: 10px;␊
      padding-left: 10px;␊
      padding-bottom: 10px;␊
      padding-right: 10px;␊
    }␊
    .button-36d38--size-small .button-36d38__icon␊
    {␊
      padding: 20px;␊
    }␊
    .button-36d38--inverse .button-36d38__something, .button-36d38__something-else␊
    {␊
      color: green;␊
      font-size: var(--my-font-size__hash);␊
    }␊
    @media screen and (min-width: 900px) {␊
    .button-36d38␊
    {␊
      color: black;␊
    }␊
    .button-36d38--inverse .button-36d38__something␊
    {␊
      color: blue;␊
    }␊
    }`

## should process basic style and output minified result

> Snapshot 1

    '.button-36d38{color:red;background-color:red}.button-36d38:hover{color:green}.button-36d38--inverse .button-36d38__something{color:green;font-size:var(--my-font-size__hash);padding:10px}.button-36d38--size-small .button-36d38__icon{padding:20px}.button-36d38--inverse .button-36d38__something,.button-36d38__something-else{color:green;font-size:var(--my-font-size__hash)}@media screen and (min-width:900px){.button-36d38{color:#000}.button-36d38--inverse .button-36d38__something{color:#00f}}'