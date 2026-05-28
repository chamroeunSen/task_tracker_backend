/**
 * Generates DynamoDB UpdateExpression params dynamically.
 * @param {string} tableName - Name of the target DynamoDB table.
 * @param {Object} key - Primary key object, e.g., { id: "123" }
 * @param {Object} body - Request body containing fields to update.
 * @returns {Object|null} DynamoDB params or null if no updates exist.
 */
export function buildUpdateParams(tableName, key, body) {
  const safeUpdates = { ...body };
  
  // Remove primary key fields from updates to avoid DynamoDB errors
  Object.keys(key).forEach(k => delete safeUpdates[k]);

  const keys = Object.keys(safeUpdates);
  if (keys.length === 0) return null; 

  const updateExpressions = keys.map(k => `#${k} = :${k}`);
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  keys.forEach(k => {
    expressionAttributeNames[`#${k}`] = k;
    expressionAttributeValues[`:${k}`] = safeUpdates[k];
  });

  return {
    TableName: tableName,
    Key: key, 
    UpdateExpression: `SET ${updateExpressions.join(", ")}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues, 
    ReturnValues: "ALL_NEW"
  };
}