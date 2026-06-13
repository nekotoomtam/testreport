function getPageSize(doc) {
  const pageSize = doc?.internal?.pageSize;

  if (!pageSize) {
    return { width: 0, height: 0 };
  }

  const width = typeof pageSize.getWidth === 'function' ? pageSize.getWidth() : pageSize.width;
  const height = typeof pageSize.getHeight === 'function' ? pageSize.getHeight() : pageSize.height;

  return { width: Number(width) || 0, height: Number(height) || 0 };
}

function isNear(value, target, tolerance = 1.5) {
  return Math.abs(value - target) <= tolerance;
}

function hasOption(code, optionName, expectedValue) {
  const pattern = new RegExp(`${optionName}\\s*:\\s*['"]${expectedValue}['"]`, 'i');

  return pattern.test(code);
}

function hasA3PageSize(doc) {
  const { width, height } = getPageSize(doc);

  return (
    (isNear(width, 297) && isNear(height, 420)) ||
    (isNear(width, 420) && isNear(height, 297))
  );
}

function hasA4PortraitPage(doc) {
  const { width, height } = getPageSize(doc);

  return isNear(width, 210, 2) && isNear(height, 297, 2);
}

function hasLandscapePage(doc) {
  const { width, height } = getPageSize(doc);

  return width > height;
}

function parseArithmeticExpression(source) {
  let index = 0;

  function skipWhitespace() {
    while (/\s/.test(source[index])) {
      index += 1;
    }
  }

  function parseNumber() {
    skipWhitespace();

    const match = source.slice(index).match(/^(?:\d+(?:\.\d*)?|\.\d+)/);

    if (!match) {
      return null;
    }

    index += match[0].length;

    return Number(match[0]);
  }

  function parseFactor() {
    skipWhitespace();

    if (source[index] === '+') {
      index += 1;
      return parseFactor();
    }

    if (source[index] === '-') {
      index += 1;
      const value = parseFactor();

      return value === null ? null : -value;
    }

    if (source[index] === '(') {
      index += 1;
      const value = parseExpression();

      skipWhitespace();

      if (source[index] !== ')') {
        return null;
      }

      index += 1;

      return value;
    }

    return parseNumber();
  }

  function parseTerm() {
    let value = parseFactor();

    if (value === null) {
      return null;
    }

    while (true) {
      skipWhitespace();

      const operator = source[index];

      if (operator !== '*' && operator !== '/') {
        break;
      }

      index += 1;

      const nextValue = parseFactor();

      if (nextValue === null) {
        return null;
      }

      value = operator === '*' ? value * nextValue : value / nextValue;
    }

    return value;
  }

  function parseExpression() {
    let value = parseTerm();

    if (value === null) {
      return null;
    }

    while (true) {
      skipWhitespace();

      const operator = source[index];

      if (operator !== '+' && operator !== '-') {
        break;
      }

      index += 1;

      const nextValue = parseTerm();

      if (nextValue === null) {
        return null;
      }

      value = operator === '+' ? value + nextValue : value - nextValue;
    }

    return value;
  }

  const value = parseExpression();

  skipWhitespace();

  return index === source.length && Number.isFinite(value) ? value : null;
}

function stripWrappingParentheses(source) {
  let trimmedSource = source.trim();

  while (trimmedSource.startsWith('(') && trimmedSource.endsWith(')')) {
    let depth = 0;
    let wrapsWholeExpression = true;

    for (let index = 0; index < trimmedSource.length; index += 1) {
      const character = trimmedSource[index];

      if (character === '(') {
        depth += 1;
      } else if (character === ')') {
        depth -= 1;
      }

      if (depth === 0 && index < trimmedSource.length - 1) {
        wrapsWholeExpression = false;
        break;
      }
    }

    if (!wrapsWholeExpression || depth !== 0) {
      break;
    }

    trimmedSource = trimmedSource.slice(1, -1).trim();
  }

  return trimmedSource;
}

function getNumericDeclarationSource(code, variableName) {
  const pattern = /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*([^;\n]+)/gi;
  let match = pattern.exec(code);

  while (match) {
    if (match[1] === variableName) {
      return match[2];
    }

    match = pattern.exec(code);
  }

  return null;
}

function resolveNumericArg(code, source, seenVariables = new Set()) {
  const trimmedSource = stripWrappingParentheses(source);

  if (/^-?(?:\d+(?:\.\d*)?|\.\d+)$/.test(trimmedSource)) {
    return Number(trimmedSource);
  }

  if (/^[A-Za-z_$][\w$]*$/.test(trimmedSource)) {
    if (seenVariables.has(trimmedSource)) {
      return null;
    }

    const declarationSource = getNumericDeclarationSource(code, trimmedSource);

    if (!declarationSource) {
      return null;
    }

    return resolveNumericArg(code, declarationSource, new Set([...seenVariables, trimmedSource]));
  }

  if (!/^[\w$.\s+\-*/()]+$/.test(trimmedSource)) {
    return null;
  }

  let hasUnresolvedVariable = false;
  const expressionWithNumbers = trimmedSource.replace(/\b[A-Za-z_$][\w$]*\b/g, (variableName) => {
    const value = resolveNumericArg(code, variableName, seenVariables);

    if (!Number.isFinite(value)) {
      hasUnresolvedVariable = true;
      return 'NaN';
    }

    return String(value);
  });

  if (hasUnresolvedVariable || !/^[\d\s+\-*/().]+$/.test(expressionWithNumbers)) {
    return null;
  }

  return parseArithmeticExpression(expressionWithNumbers);
}

function findTextCall(code, text) {
  const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `doc\\.text\\(\\s*(['"\`])${escapedText}\\1\\s*,\\s*([^,\n)]+)\\s*,\\s*([^,\n)]+)([^)]*)\\)`,
    'i',
  );
  const match = code.match(pattern);

  if (!match) {
    return null;
  }

  const x = resolveNumericArg(code, match[2]);
  const y = resolveNumericArg(code, match[3]);

  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return null;
  }

  return {
    x,
    y,
    optionsSource: match[4] ?? '',
  };
}

function findTextCalls(code) {
  const pattern = /doc\.text\(\s*([\s\S]*?)\s*,\s*([^,\n)]+)\s*,\s*([^,\n)]+)([^;]*?)\)/gi;
  const textCalls = [];
  let match = pattern.exec(code);

  while (match) {
    const x = resolveNumericArg(code, match[2]);
    const y = resolveNumericArg(code, match[3]);

    if (Number.isFinite(x) && Number.isFinite(y)) {
      textCalls.push({
        textSource: match[1].trim(),
        x,
        y,
        optionsSource: match[4] ?? '',
      });
    }

    match = pattern.exec(code);
  }

  return textCalls;
}

function findRectCall(code) {
  return findRectCalls(code)[0] ?? null;
}

function findRectCalls(code) {
  const pattern =
    /doc\.rect\(\s*([^,\n)]+)\s*,\s*([^,\n)]+)\s*,\s*([^,\n)]+)\s*,\s*([^,\n)]+)/gi;
  const rectCalls = [];
  let match = pattern.exec(code);

  while (match) {
    const rectCall = {
      x: resolveNumericArg(code, match[1]),
      y: resolveNumericArg(code, match[2]),
      width: resolveNumericArg(code, match[3]),
      height: resolveNumericArg(code, match[4]),
    };

    if (Object.values(rectCall).every((value) => Number.isFinite(value))) {
      rectCalls.push(rectCall);
    }

    match = pattern.exec(code);
  }

  return rectCalls;
}

function findLineCalls(code) {
  const pattern =
    /doc\.line\(\s*([^,\n)]+)\s*,\s*([^,\n)]+)\s*,\s*([^,\n)]+)\s*,\s*([^,\n)]+)/gi;
  const lineCalls = [];
  let match = pattern.exec(code);

  while (match) {
    const lineCall = {
      x1: resolveNumericArg(code, match[1]),
      y1: resolveNumericArg(code, match[2]),
      x2: resolveNumericArg(code, match[3]),
      y2: resolveNumericArg(code, match[4]),
    };

    if (Object.values(lineCall).every((value) => Number.isFinite(value))) {
      lineCalls.push(lineCall);
    }

    match = pattern.exec(code);
  }

  return lineCalls;
}

function hasDocCall(code, methodName) {
  const pattern = new RegExp(`doc\\.${methodName}\\s*\\(`, 'g');

  return pattern.test(code);
}

function countDocCalls(code, methodName) {
  const pattern = new RegExp(`doc\\.${methodName}\\s*\\(`, 'g');

  return code.match(pattern)?.length ?? 0;
}

function hasNamedConst(code, variableName) {
  const pattern = new RegExp(`\\b(?:const|let|var)\\s+${variableName}\\s*=`);

  return pattern.test(code);
}

function hasFilledDrawnRect(code) {
  const pattern =
    /doc\.rect\(\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*(['"])(FD|DF)\1\s*\)/i;

  return pattern.test(code);
}

function countFilledDrawnRects(code) {
  return code.match(/doc\.rect\(\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*(['"])(FD|DF)\1\s*\)/gi)?.length ?? 0;
}

function hasImagePathVariable(code) {
  return /\b(?:const|let|var)\s+imagePath\s*=\s*['"]\/images\/[^'"]+['"]/i.test(code);
}

function hasGetLessonImageCall(code) {
  return /getLessonImage\(\s*imagePath\s*\)/i.test(code);
}

function hasProjectImagePath(code) {
  return /imagePath\s*:\s*['"]\/images\/[^'"]+['"]/i.test(code);
}

function findAddImageCall(code) {
  const pattern =
    /doc\.addImage\(\s*[^,]+,\s*['"][^'"]+['"]\s*,\s*([^,\n)]+)\s*,\s*([^,\n)]+)\s*,\s*([^,\n)]+)\s*,\s*([^,\n)]+)/i;
  const match = code.match(pattern);

  if (!match) {
    return null;
  }

  return {
    x: resolveNumericArg(code, match[1]),
    y: resolveNumericArg(code, match[2]),
    width: resolveNumericArg(code, match[3]),
    height: resolveNumericArg(code, match[4]),
  };
}

function hasThaiText(code) {
  return /[\u0E00-\u0E7F]/.test(code);
}

function hasThaiTextCall(code) {
  return /doc\.text\(\s*(['"`])[^'"`]*[\u0E00-\u0E7F][^'"`]*\1\s*,/i.test(code);
}

function hasThaiFontSetCall(code) {
  return (
    /doc\.setFont\(\s*PDF_FONTS\.thai\.family\s*,/i.test(code) ||
    /doc\.setFont\(\s*['"]THSarabunNew['"]\s*,/i.test(code)
  );
}

function countProjectPropertyUses(code) {
  return code.match(/project\.(name|date|owner|status|summary)/gi)?.length ?? 0;
}

const projectDataFields = ['name', 'date', 'owner', 'status', 'summary', 'imagePath'];
const requiredProjectTextFields = ['name', 'date', 'owner', 'status'];

function findMatchingParen(code, openParenIndex) {
  let depth = 0;
  let quote = '';
  let isEscaped = false;

  for (let index = openParenIndex; index < code.length; index += 1) {
    const character = code[index];

    if (quote) {
      if (isEscaped) {
        isEscaped = false;
        continue;
      }

      if (character === '\\') {
        isEscaped = true;
        continue;
      }

      if (character === quote) {
        quote = '';
      }

      continue;
    }

    if (character === '"' || character === "'" || character === '`') {
      quote = character;
      continue;
    }

    if (character === '(') {
      depth += 1;
      continue;
    }

    if (character === ')') {
      depth -= 1;

      if (depth === 0) {
        return index;
      }
    }
  }

  return -1;
}

function findCallArgumentSources(code, callPattern) {
  const sources = [];
  let match = callPattern.exec(code);

  while (match) {
    const openParenIndex = code.indexOf('(', match.index);
    const closeParenIndex = findMatchingParen(code, openParenIndex);

    if (openParenIndex >= 0 && closeParenIndex > openParenIndex) {
      sources.push(code.slice(openParenIndex + 1, closeParenIndex));
    }

    match = callPattern.exec(code);
  }

  return sources;
}

function getProjectPropertyAliasMap(code) {
  const aliasesByField = new Map(projectDataFields.map((field) => [field, new Set()]));
  const directAliasPattern =
    /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*project\.(name|date|owner|status|summary|imagePath)\b/gi;
  let directAliasMatch = directAliasPattern.exec(code);

  while (directAliasMatch) {
    aliasesByField.get(directAliasMatch[2])?.add(directAliasMatch[1]);
    directAliasMatch = directAliasPattern.exec(code);
  }

  const destructuringPattern = /\b(?:const|let|var)\s*{\s*([^}]+)\s*}\s*=\s*project\b/gi;
  let destructuringMatch = destructuringPattern.exec(code);

  while (destructuringMatch) {
    destructuringMatch[1]
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
      .forEach((part) => {
        const [fieldName, aliasName] = part.split(':').map((value) => value.trim());

        if (!projectDataFields.includes(fieldName)) {
          return;
        }

        aliasesByField.get(fieldName)?.add(aliasName || fieldName);
      });

    destructuringMatch = destructuringPattern.exec(code);
  }

  return aliasesByField;
}

function sourceUsesProjectField(source, fieldName, aliasesByField) {
  const escapedFieldName = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const directFieldPattern = new RegExp(
    `project\\s*(?:\\.\\s*${escapedFieldName}|\\[\\s*['"]${escapedFieldName}['"]\\s*\\])`,
    'i',
  );

  if (directFieldPattern.test(source)) {
    return true;
  }

  return [...(aliasesByField.get(fieldName) ?? [])].some((aliasName) =>
    new RegExp(`\\b${aliasName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(source),
  );
}

function hasProjectFieldInDocTextCall(code, fieldName) {
  const aliasesByField = getProjectPropertyAliasMap(code);

  return findCallArgumentSources(code, /doc\.text\s*\(/gi).some((textCallSource) =>
    sourceUsesProjectField(textCallSource, fieldName, aliasesByField),
  );
}

function hasProjectPropertyInTextCall(code) {
  return ['name', 'date', 'owner', 'status', 'summary'].some((fieldName) =>
    hasProjectFieldInDocTextCall(code, fieldName),
  );
}

function hasGetProjectImageCall(code) {
  const aliasesByField = getProjectPropertyAliasMap(code);

  return findCallArgumentSources(code, /getLessonImage\s*\(/gi).some((imageCallSource) =>
    sourceUsesProjectField(imageCallSource, 'imagePath', aliasesByField),
  );
}

function hasProjectObject(code) {
  return /\b(?:const|let|var)\s+project\s*=\s*{/i.test(code);
}

function hasProjectMilestonesArray(code) {
  return /milestones\s*:\s*\[/i.test(code) || /\b(?:const|let|var)\s+milestones\s*=\s*\[/i.test(code);
}

function usesRequiredProjectFields(code) {
  return (
    requiredProjectTextFields.every((fieldName) =>
      hasProjectFieldInDocTextCall(code, fieldName),
    ) && hasGetProjectImageCall(code)
  );
}

function hasMilestonesArray(code) {
  return /\b(?:const|let|var)\s+milestones\s*=\s*\[/i.test(code);
}

function hasMilestonesIteration(code) {
  return /(?:project\.)?milestones\.(forEach|map)\s*\(/i.test(code);
}

function hasRowYFromIndex(code) {
  return (
    /\b(?:const|let|var)\s+y\s*=.[^;]*index\s*[*+-]/i.test(code) ||
    /index\s*\*\s*\d+/i.test(code)
  );
}

function hasLongProjectSummary(code) {
  const match = code.match(/summary\s*:\s*(['"`])([\s\S]*?)\1/i);

  return Boolean(match && match[2].length >= 80);
}

function hasSplitTextToSizeCall(code) {
  return /doc\.splitTextToSize\(\s*project\.summary\s*,/i.test(code);
}

function hasProjectSummaryWrap(code) {
  return /doc\.splitTextToSize\(\s*project\.summary\s*,/i.test(code);
}

function hasStyleEvidence(code) {
  return ['setFontSize', 'setTextColor', 'setDrawColor', 'setFillColor', 'setFont'].some(
    (methodName) => hasDocCall(code, methodName),
  );
}

function hasSetFontSize(code, size) {
  const pattern = /doc\.setFontSize\(\s*([^,\n)]+)/gi;
  let match = pattern.exec(code);

  while (match) {
    if (isNear(resolveNumericArg(code, match[1]), size, 0.25)) {
      return true;
    }

    match = pattern.exec(code);
  }

  return false;
}

function hasRgbColorCall(code, methodName, red, green, blue) {
  const pattern = new RegExp(
    `doc\\.${methodName}\\(\\s*([^,\n)]+)\\s*,\\s*([^,\n)]+)\\s*,\\s*([^,\n)]+)`,
    'gi',
  );
  let match = pattern.exec(code);

  while (match) {
    const colorValues = [
      resolveNumericArg(code, match[1]),
      resolveNumericArg(code, match[2]),
      resolveNumericArg(code, match[3]),
    ];

    if (
      isNear(colorValues[0], red, 0.25) &&
      isNear(colorValues[1], green, 0.25) &&
      isNear(colorValues[2], blue, 0.25)
    ) {
      return true;
    }

    match = pattern.exec(code);
  }

  return false;
}

function hasCheckpointContractColors(code) {
  const hasPrimaryOrBodyText =
    hasRgbColorCall(code, 'setTextColor', 17, 24, 39) ||
    hasRgbColorCall(code, 'setTextColor', 71, 85, 105);
  const hasAccentLine = hasRgbColorCall(code, 'setDrawColor', 36, 87, 214);
  const hasCardBorder = hasRgbColorCall(code, 'setDrawColor', 203, 213, 225);
  const hasCardFill = hasRgbColorCall(code, 'setFillColor', 248, 250, 252);

  return hasPrimaryOrBodyText && hasAccentLine && hasCardBorder && hasCardFill;
}

function hasFooterNearPageBottom(code) {
  const footerY = resolveNumericArg(code, 'footerY');

  if (footerY && footerY >= 260 && /doc\.text\([^;]*footerY/i.test(code)) {
    return true;
  }

  const textPattern = /doc\.text\(\s*(?:['"`][^'"`]*['"`]|[A-Za-z_$][\w$]*)\s*,\s*([^,\n)]+)\s*,\s*([^,\n)]+)/gi;
  let match = textPattern.exec(code);

  while (match) {
    const y = resolveNumericArg(code, match[2]);

    if (Number.isFinite(y) && y >= 260) {
      return true;
    }

    match = textPattern.exec(code);
  }

  return false;
}

function hasCheckpointHeaderBlueprint(code) {
  const titleCall = findTextCall(code, 'Project Summary');
  const titleIsInHeaderZone =
    titleCall && isInRange(titleCall.x, 15, 35) && isInRange(titleCall.y, 16, 30);
  const dividerIsInHeaderZone = findLineCalls(code).some(
    (lineCall) =>
      isInRange(lineCall.y1, 26, 36) &&
      isInRange(lineCall.y2, 26, 36) &&
      lineCall.x1 <= 25 &&
      lineCall.x2 >= 180,
  );

  return Boolean(titleIsInHeaderZone && dividerIsInHeaderZone);
}

function hasCheckpointImageInBlueprintZone(code) {
  const addImageCall = findAddImageCall(code);

  return Boolean(
    addImageCall &&
      hasProjectImagePath(code) &&
      hasGetProjectImageCall(code) &&
      isInRange(addImageCall.x, 145, 172) &&
      isInRange(addImageCall.y, 46, 72) &&
      isInRange(addImageCall.width, 22, 42) &&
      isInRange(addImageCall.height, 14, 30),
  );
}

function hasRectInZone(code, minY, maxY, minWidth = 130) {
  return findRectCalls(code).some(
    (rectCall) => isInRange(rectCall.y, minY, maxY) && rectCall.width >= minWidth,
  );
}

function hasCheckpointSectionStack(code) {
  const hasInfoCard = hasRectInZone(code, 36, 58);
  const hasSummaryCard = hasRectInZone(code, 92, 122);
  const hasStatusCard = hasRectInZone(code, 162, 198);

  return hasInfoCard && hasSummaryCard && hasStatusCard;
}

function hasReturnDoc(code) {
  return /return\s+doc\s*;?/.test(code);
}

function hasLayoutVariables(code) {
  return isNear(resolveNumericArg(code, 'pageMargin'), 20, 0.25) &&
    isNear(resolveNumericArg(code, 'contentWidth'), 170, 0.25);
}

function hasTextAt(code, text, expectedX, expectedY, tolerance = 1.5) {
  const textCall = findTextCall(code, text);

  return Boolean(
    textCall &&
      isNear(textCall.x, expectedX, tolerance) &&
      isNear(textCall.y, expectedY, tolerance),
  );
}

function hasRightAlignedDateAtHeader(code) {
  const aliasesByField = getProjectPropertyAliasMap(code);

  return findTextCalls(code).some(
    (textCall) =>
      isNear(textCall.x, 190, 1.5) &&
      isNear(textCall.y, 24, 1.5) &&
      /align\s*:\s*['"]right['"]/i.test(textCall.optionsSource) &&
      (/2026-06-13/.test(textCall.textSource) ||
        sourceUsesProjectField(textCall.textSource, 'date', aliasesByField)),
  );
}

function hasLineSegment(code, expectedX1, expectedY, expectedX2, tolerance = 1.5) {
  return findLineCalls(code).some(
    (lineCall) =>
      isNear(lineCall.x1, expectedX1, tolerance) &&
      isNear(lineCall.x2, expectedX2, tolerance) &&
      isNear(lineCall.y1, expectedY, tolerance) &&
      isNear(lineCall.y2, expectedY, tolerance),
  );
}

function hasRectAt(code, expectedX, expectedY, expectedWidth, expectedHeight, tolerance = 1.5) {
  return findRectCalls(code).some(
    (rectCall) =>
      isNear(rectCall.x, expectedX, tolerance) &&
      isNear(rectCall.y, expectedY, tolerance) &&
      isNear(rectCall.width, expectedWidth, tolerance) &&
      isNear(rectCall.height, expectedHeight, tolerance),
  );
}

function hasProjectBriefHeader(code) {
  return hasTextAt(code, 'Project Brief', 20, 24) && hasRightAlignedDateAtHeader(code);
}

function hasProjectBriefCards(code) {
  return (
    hasRectAt(code, 20, 44, 170, 44) &&
    hasRectAt(code, 20, 106, 170, 56) &&
    hasRectAt(code, 20, 178, 170, 64)
  );
}

function hasProjectBriefImage(code, requireProjectImagePath = false) {
  const addImageCall = findAddImageCall(code);

  return Boolean(
    addImageCall &&
      (!requireProjectImagePath || (hasProjectImagePath(code) && hasGetProjectImageCall(code))) &&
      isNear(addImageCall.x, 150, 1.5) &&
      isNear(addImageCall.y, 54, 1.5) &&
      isNear(addImageCall.width, 36, 1.5) &&
      isNear(addImageCall.height, 24, 1.5),
  );
}

function hasProjectBriefStyle(code) {
  return (
    hasSetFontSize(code, 22) &&
    hasSetFontSize(code, 18) &&
    hasSetFontSize(code, 16) &&
    (hasRgbColorCall(code, 'setTextColor', 17, 24, 39) ||
      hasRgbColorCall(code, 'setTextColor', 71, 85, 105)) &&
    hasRgbColorCall(code, 'setDrawColor', 203, 213, 225) &&
    hasRgbColorCall(code, 'setFillColor', 248, 250, 252) &&
    countFilledDrawnRects(code) >= 3
  );
}

function hasWrappedSummaryInCard(code) {
  const wrappedTextCall = findTextCalls(code).find((textCall) =>
    /\bwrappedSummary\b/.test(textCall.textSource),
  );

  return Boolean(
    hasProjectSummaryWrap(code) &&
      wrappedTextCall &&
      isInRange(wrappedTextCall.x, 26, 32) &&
      isInRange(wrappedTextCall.y, 132, 140),
  );
}

function hasMilestoneRowsInCard(code) {
  return (
    hasProjectMilestonesArray(code) &&
    hasMilestonesIteration(code) &&
    /(?:const|let|var)\s+rowY\s*=[^;]*index\s*\*/i.test(code)
  );
}

function hasProjectBriefFooter(code) {
  return hasLineSegment(code, 20, 270, 190, 2) && hasFooterNearPageBottom(code);
}

function hasImageAssetFlow(code) {
  return (
    (hasImagePathVariable(code) && hasGetLessonImageCall(code)) ||
    (hasProjectImagePath(code) && hasGetProjectImageCall(code))
  );
}

function hasStage1Base(code, doc) {
  return (
    hasOption(code, 'unit', 'mm') &&
    (hasOption(code, 'format', 'a4') || hasA4PortraitPage(doc)) &&
    hasReturnDoc(code)
  );
}

function hasStage2Header(code, doc) {
  return hasStage1Base(code, doc) && hasLayoutVariables(code) && hasProjectBriefHeader(code);
}

function hasStage3Skeleton(code, doc) {
  return (
    hasStage2Header(code, doc) &&
    hasLineSegment(code, 20, 32, 190) &&
    hasProjectBriefCards(code)
  );
}

function hasStage4StyleContract(code, doc) {
  return hasStage3Skeleton(code, doc) && hasProjectBriefStyle(code);
}

function hasStage5Image(code, doc) {
  return hasStage4StyleContract(code, doc) && hasImageAssetFlow(code) && hasProjectBriefImage(code);
}

function hasStage6ThaiFont(code, doc) {
  return (
    hasStage5Image(code, doc) &&
    /registerThaiFont\(\s*doc\s*\)/i.test(code) &&
    hasThaiFontSetCall(code) &&
    hasThaiText(code) &&
    hasThaiTextCall(code)
  );
}

function hasStage7DataMapping(code, doc) {
  return (
    hasStage6ThaiFont(code, doc) &&
    hasProjectObject(code) &&
    usesRequiredProjectFields(code) &&
    hasProjectPropertyInTextCall(code) &&
    hasProjectMilestonesArray(code) &&
    hasMilestonesIteration(code) &&
    hasRowYFromIndex(code)
  );
}

function hasStage8SummaryWrap(code, doc) {
  return (
    hasStage7DataMapping(code, doc) &&
    hasLongProjectSummary(code) &&
    isNear(resolveNumericArg(code, 'summaryWidth'), 154, 0.25) &&
    hasSplitTextToSizeCall(code) &&
    hasWrappedSummaryInCard(code)
  );
}

function hasAlignOption(textCall, alignValue) {
  if (!textCall) {
    return false;
  }

  const pattern = new RegExp(`align\\s*:\\s*['"]${alignValue}['"]`, 'i');

  return pattern.test(textCall.optionsSource);
}

function isInRange(value, min, max) {
  return value >= min && value <= max;
}

function pointMatches(point, expectedPoint, tolerance = 2) {
  return isNear(point.x, expectedPoint.x, tolerance) && isNear(point.y, expectedPoint.y, tolerance);
}

function lineMatchesSegment(lineCall, startPoint, endPoint) {
  const lineStart = { x: lineCall.x1, y: lineCall.y1 };
  const lineEnd = { x: lineCall.x2, y: lineCall.y2 };

  return (
    (pointMatches(lineStart, startPoint) && pointMatches(lineEnd, endPoint)) ||
    (pointMatches(lineStart, endPoint) && pointMatches(lineEnd, startPoint))
  );
}

function getRectCorners(rectCall) {
  if (!rectCall) {
    return null;
  }

  return {
    topLeft: { x: rectCall.x, y: rectCall.y },
    topRight: { x: rectCall.x + rectCall.width, y: rectCall.y },
    bottomLeft: { x: rectCall.x, y: rectCall.y + rectCall.height },
    bottomRight: { x: rectCall.x + rectCall.width, y: rectCall.y + rectCall.height },
  };
}

const lessonCheckers = {
  'hello-pdf': {
    'page-a4-mm': ({ code, doc }) =>
      hasOption(code, 'unit', 'mm') && (hasOption(code, 'format', 'a4') || hasA4PortraitPage(doc)),
    'return-doc': ({ code }) => hasReturnDoc(code),
    'run-preview': ({ doc }) => Boolean(doc && typeof doc.output === 'function'),
  },
  'xy-position': {
    'previous-stage': ({ code, doc }) => hasStage1Base(code, doc),
    'layout-vars': ({ code }) => hasLayoutVariables(code),
    'header-title': ({ code }) => hasTextAt(code, 'Project Brief', 20, 24),
    'header-date': ({ code }) => hasRightAlignedDateAtHeader(code),
    'date-align-right': ({ code }) => hasRightAlignedDateAtHeader(code),
    'run-preview': ({ doc }) => Boolean(doc && typeof doc.output === 'function'),
  },
  'line-rect': {
    'previous-stage': ({ code, doc }) => hasStage2Header(code, doc),
    'header-divider': ({ code }) => hasLineSegment(code, 20, 32, 190),
    'info-card': ({ code }) => hasRectAt(code, 20, 44, 170, 44),
    'summary-card': ({ code }) => hasRectAt(code, 20, 106, 170, 56),
    'milestone-card': ({ code }) => hasRectAt(code, 20, 178, 170, 64),
    'run-preview': ({ doc }) => Boolean(doc && typeof doc.output === 'function'),
  },
  style: {
    'previous-stage': ({ code, doc }) => hasStage3Skeleton(code, doc),
    'title-style': ({ code }) =>
      hasSetFontSize(code, 22) && hasRgbColorCall(code, 'setTextColor', 17, 24, 39),
    'heading-style': ({ code }) => hasSetFontSize(code, 18),
    'body-style': ({ code }) =>
      hasSetFontSize(code, 16) && hasRgbColorCall(code, 'setTextColor', 71, 85, 105),
    'card-style': ({ code }) =>
      hasRgbColorCall(code, 'setDrawColor', 203, 213, 225) &&
      hasRgbColorCall(code, 'setFillColor', 248, 250, 252) &&
      countFilledDrawnRects(code) >= 3,
    'run-preview': ({ doc }) => Boolean(doc && typeof doc.output === 'function'),
  },
  image: {
    'previous-stage': ({ code, doc }) => hasStage4StyleContract(code, doc),
    'image-path': ({ code }) => hasImagePathVariable(code),
    'image-data': ({ code }) => hasGetLessonImageCall(code),
    'image-placement': ({ code }) => hasProjectBriefImage(code),
    'image-size': ({ code }) => hasProjectBriefImage(code),
    'run-preview': ({ doc }) => Boolean(doc && typeof doc.output === 'function'),
  },
  'thai-font': {
    'previous-stage': ({ code, doc }) => hasStage5Image(code, doc),
    'register-thai-font': ({ code }) => /registerThaiFont\(\s*doc\s*\)/i.test(code),
    'set-thai-font': ({ code }) => hasThaiFontSetCall(code),
    'thai-heading': ({ code }) => /doc\.text\(\s*(['"`])(?:ข้อมูลโปรเจกต์|สรุปภาพรวม|หมุดหมายงาน)\1\s*,/i.test(code),
    'thai-body': ({ code }) => hasThaiText(code) && hasThaiTextCall(code),
    'run-preview': ({ doc }) => Boolean(doc && typeof doc.output === 'function'),
  },
  'data-mapping': {
    'previous-stage': ({ code, doc }) => hasStage6ThaiFont(code, doc),
    'project-object': ({ code }) => hasProjectObject(code),
    'project-fields': ({ code }) =>
      usesRequiredProjectFields(code) && hasProjectPropertyInTextCall(code),
    'milestones-array': ({ code }) => hasProjectMilestonesArray(code),
    'milestones-loop': ({ code }) => hasMilestonesIteration(code),
    'row-y-position': ({ code }) => hasRowYFromIndex(code),
    'run-preview': ({ doc }) => Boolean(doc && typeof doc.output === 'function'),
  },
  'text-wrap': {
    'previous-stage': ({ code, doc }) => hasStage7DataMapping(code, doc),
    'long-summary': ({ code }) => hasProjectObject(code) && hasLongProjectSummary(code),
    'summary-width': ({ code }) => isNear(resolveNumericArg(code, 'summaryWidth'), 154, 0.25),
    'split-summary': ({ code }) => hasSplitTextToSizeCall(code),
    'wrapped-summary-text': ({ code }) => hasWrappedSummaryInCard(code),
    'run-preview': ({ doc }) => Boolean(doc && typeof doc.output === 'function'),
  },
  'one-page-layout': {
    'previous-stage': ({ code, doc }) => hasStage8SummaryWrap(code, doc),
    'section-stack': ({ code }) =>
      hasProjectBriefHeader(code) &&
      hasLineSegment(code, 20, 32, 190) &&
      hasProjectBriefCards(code),
    'image-in-info': ({ code }) => hasProjectBriefImage(code, true),
    'wrapped-summary': ({ code }) => hasWrappedSummaryInCard(code),
    'milestone-rows': ({ code }) => hasMilestoneRowsInCard(code),
    footer: ({ code }) => hasProjectBriefFooter(code),
    'run-preview': ({ doc }) => Boolean(doc && typeof doc.output === 'function'),
  },
  'checkpoint-project-summary': {
    'final-page': ({ code, doc }) =>
      hasOption(code, 'unit', 'mm') && (hasOption(code, 'format', 'a4') || hasA4PortraitPage(doc)) && hasReturnDoc(code),
    'final-header': ({ code }) => hasProjectBriefHeader(code) && hasLineSegment(code, 20, 32, 190),
    'final-cards': ({ code }) => hasProjectBriefCards(code),
    'final-style': ({ code }) => hasProjectBriefStyle(code),
    'final-image': ({ code }) => hasProjectBriefImage(code, true),
    'final-data': ({ code }) =>
      hasProjectObject(code) &&
      usesRequiredProjectFields(code) &&
      hasProjectMilestonesArray(code) &&
      hasMilestonesIteration(code),
    'final-wrap': ({ code }) => hasWrappedSummaryInCard(code),
    'final-footer': ({ code }) => hasProjectBriefFooter(code),
    'run-preview': ({ doc }) => Boolean(doc && typeof doc.output === 'function'),
  },
};

export function evaluateLessonChecklist(lesson, code, doc) {
  if (!lesson.completionChecklist?.length) {
    return {};
  }

  const checkers = lessonCheckers[lesson.id] ?? {};

  return lesson.completionChecklist.reduce((result, item) => {
    const checker = checkers[item.id];

    return {
      ...result,
      [item.id]: checker ? Boolean(checker({ code, doc })) : false,
    };
  }, {});
}
