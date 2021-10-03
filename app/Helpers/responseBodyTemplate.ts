interface IresponseBodyTemplate {
  type: string
  result?: any
  violation?: string
}

const ResponseBodyTemplate = ({ type, result, violation }: IresponseBodyTemplate) => {
  if (violation) return { type, status: 'failure', violation }
  return { type, status: 'success', result }
}

export default ResponseBodyTemplate
