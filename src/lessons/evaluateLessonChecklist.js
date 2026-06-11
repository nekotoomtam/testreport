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

function hasLandscapePage(doc) {
  const { width, height } = getPageSize(doc);

  return width > height;
}

function findTextCall(code, text) {
  const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `doc\\.text\\(\\s*(['"\`])${escapedText}\\1\\s*,\\s*(\\d+(?:\\.\\d+)?)\\s*,\\s*(\\d+(?:\\.\\d+)?)([^)]*)\\)`,
    'i',
  );
  const match = code.match(pattern);

  if (!match) {
    return null;
  }

  return {
    x: Number(match[2]),
    y: Number(match[3]),
    optionsSource: match[4] ?? '',
  };
}

function findRectCall(code) {
  return findRectCalls(code)[0] ?? null;
}

function findNumericConst(code, variableName) {
  const pattern = new RegExp(`const\\s+${variableName}\\s*=\\s*(\\d+(?:\\.\\d+)?)`, 'i');
  const match = code.match(pattern);

  return match ? Number(match[1]) : null;
}

function resolveNumericArg(code, source) {
  const trimmedSource = source.trim();

  if (/^\d+(?:\.\d+)?$/.test(trimmedSource)) {
    return Number(trimmedSource);
  }

  if (/^[A-Za-z_$][\w$]*$/.test(trimmedSource)) {
    return findNumericConst(code, trimmedSource);
  }

  return null;
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

    if (Object.values(rectCall).every((value) => typeof value === 'number')) {
      rectCalls.push(rectCall);
    }

    match = pattern.exec(code);
  }

  return rectCalls;
}

function findLineCalls(code) {
  const pattern =
    /doc\.line\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)/gi;
  const lineCalls = [];
  let match = pattern.exec(code);

  while (match) {
    lineCalls.push({
      x1: Number(match[1]),
      y1: Number(match[2]),
      x2: Number(match[3]),
      y2: Number(match[4]),
    });
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
  const pattern = new RegExp(`const\\s+${variableName}\\s*=`);

  return pattern.test(code);
}

function hasFilledDrawnRect(code) {
  const pattern =
    /doc\.rect\(\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*(['"])(FD|DF)\1\s*\)/i;

  return pattern.test(code);
}

function hasImagePathVariable(code) {
  return /const\s+imagePath\s*=\s*['"]\/images\/[^'"]+['"]/i.test(code);
}

function hasGetLessonImageCall(code) {
  return /getLessonImage\(\s*imagePath\s*\)/i.test(code);
}

function hasProjectImagePath(code) {
  return /imagePath\s*:\s*['"]\/images\/[^'"]+['"]/i.test(code);
}

function hasGetProjectImageCall(code) {
  return /getLessonImage\(\s*project\.imagePath\s*\)/i.test(code);
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

function hasProjectObject(code) {
  return /const\s+project\s*=\s*{/i.test(code);
}

function usesRequiredProjectFields(code) {
  return ['name', 'date', 'owner', 'status', 'summary', 'imagePath'].every((field) =>
    new RegExp(`project\\.${field}\\b`, 'i').test(code),
  );
}

function hasMilestonesArray(code) {
  return /const\s+milestones\s*=\s*\[/i.test(code);
}

function hasMilestonesIteration(code) {
  return /milestones\.(forEach|map)\s*\(/i.test(code);
}

function hasRowYFromIndex(code) {
  return /const\s+y\s*=.[^;]*index\s*\*/i.test(code) || /index\s*\*\s*\d+/i.test(code);
}

function hasLongProjectSummary(code) {
  const match = code.match(/summary\s*:\s*(['"`])([\s\S]*?)\1/i);

  return Boolean(match && match[2].length >= 80);
}

function hasSplitTextToSizeCall(code) {
  return /doc\.splitTextToSize\(\s*project\.summary\s*,\s*maxWidth\s*\)/i.test(code);
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
  const pattern = new RegExp(`doc\\.setFontSize\\(\\s*${size}\\s*\\)`);

  return pattern.test(code);
}

function hasRgbColorCall(code, methodName, red, green, blue) {
  const pattern = new RegExp(
    `doc\\.${methodName}\\(\\s*${red}\\s*,\\s*${green}\\s*,\\s*${blue}\\s*\\)`,
  );

  return pattern.test(code);
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
  const footerYMatch = code.match(/const\s+footerY\s*=\s*(\d+(?:\.\d+)?)/i);
  const footerY = footerYMatch ? Number(footerYMatch[1]) : null;

  if (footerY && footerY >= 260 && /doc\.text\([^;]*footerY/i.test(code)) {
    return true;
  }

  const textPattern = /doc\.text\([^;]*,\s*[^,]+,\s*(\d+(?:\.\d+)?)/gi;
  let match = textPattern.exec(code);

  while (match) {
    if (Number(match[1]) >= 260) {
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
    'unit-mm': ({ code }) => hasOption(code, 'unit', 'mm'),
    'format-a3': ({ code, doc }) => hasOption(code, 'format', 'a3') || hasA3PageSize(doc),
    'orientation-landscape': ({ code, doc }) =>
      hasOption(code, 'orientation', 'landscape') || hasLandscapePage(doc),
    'run-preview': ({ doc }) => Boolean(doc && typeof doc.output === 'function'),
  },
  'xy-position': {
    'left-text': ({ code }) => {
      const textCall = findTextCall(code, 'Left');

      return Boolean(textCall && isInRange(textCall.x, 15, 35));
    },
    'center-text': ({ code }) => {
      const textCall = findTextCall(code, 'Center');

      return Boolean(textCall && isInRange(textCall.x, 95, 115));
    },
    'center-align': ({ code }) => hasAlignOption(findTextCall(code, 'Center'), 'center'),
    'right-text': ({ code }) => {
      const textCall = findTextCall(code, 'Right');

      return Boolean(textCall && isInRange(textCall.x, 175, 200));
    },
    'right-align': ({ code }) => hasAlignOption(findTextCall(code, 'Right'), 'right'),
    'run-preview': ({ doc }) => Boolean(doc && typeof doc.output === 'function'),
  },
  'line-rect': {
    'rect-call': ({ code }) => Boolean(findRectCall(code)),
    'center-rect': ({ code }) => {
      const rectCall = findRectCall(code);

      if (!rectCall) {
        return false;
      }

      const centerX = rectCall.x + rectCall.width / 2;

      return (
        isNear(centerX, 105, 8) &&
        isInRange(rectCall.y, 65, 105) &&
        isInRange(rectCall.width, 75, 105) &&
        isInRange(rectCall.height, 45, 75)
      );
    },
    'diagonal-down-line': ({ code }) => {
      const corners = getRectCorners(findRectCall(code));

      if (!corners) {
        return false;
      }

      return findLineCalls(code).some((lineCall) =>
        lineMatchesSegment(lineCall, corners.topLeft, corners.bottomRight),
      );
    },
    'diagonal-up-line': ({ code }) => {
      const corners = getRectCorners(findRectCall(code));

      if (!corners) {
        return false;
      }

      return findLineCalls(code).some((lineCall) =>
        lineMatchesSegment(lineCall, corners.topRight, corners.bottomLeft),
      );
    },
    'two-lines': ({ code }) => findLineCalls(code).length >= 2,
    'run-preview': ({ doc }) => Boolean(doc && typeof doc.output === 'function'),
  },
  style: {
    'card-variables': ({ code }) =>
      ['cardX', 'cardY', 'cardWidth', 'cardHeight'].every((variableName) =>
        hasNamedConst(code, variableName),
      ),
    'font-size': ({ code }) => countDocCalls(code, 'setFontSize') >= 2,
    'text-color': ({ code }) => hasDocCall(code, 'setTextColor'),
    'fill-color': ({ code }) => hasDocCall(code, 'setFillColor'),
    'draw-color': ({ code }) => hasDocCall(code, 'setDrawColor'),
    'rect-fd': ({ code }) => hasFilledDrawnRect(code),
    'divider-line': ({ code }) => hasDocCall(code, 'line'),
    'run-preview': ({ doc }) => Boolean(doc && typeof doc.output === 'function'),
  },
  image: {
    'image-path': ({ code }) => hasImagePathVariable(code),
    'get-lesson-image': ({ code }) => hasGetLessonImageCall(code),
    'add-image': ({ code }) => hasDocCall(code, 'addImage'),
    'image-size': ({ code }) => {
      const addImageCall = findAddImageCall(code);

      return Boolean(
        addImageCall &&
          isInRange(addImageCall.width, 40, 180) &&
          isInRange(addImageCall.height, 24, 120),
      );
    },
    'run-preview': ({ doc }) => Boolean(doc && typeof doc.output === 'function'),
  },
  'thai-font': {
    'register-thai-font': ({ code }) => /registerThaiFont\(\s*doc\s*\)/i.test(code),
    'use-font-metadata': ({ code }) => /PDF_FONTS\.thai/i.test(code),
    'set-thai-font': ({ code }) => hasThaiFontSetCall(code),
    'thai-text': ({ code }) => hasThaiText(code) && hasThaiTextCall(code),
    'normal-style': ({ code }) =>
      /PDF_FONTS\.thai\.style/i.test(code) || /['"]normal['"]/i.test(code),
    'run-preview': ({ doc }) => Boolean(doc && typeof doc.output === 'function'),
  },
  'data-mapping': {
    'data-object': ({ code }) => hasProjectObject(code),
    'data-array': ({ code }) => hasMilestonesArray(code),
    'property-values': ({ code }) => countProjectPropertyUses(code) >= 3,
    'array-iteration': ({ code }) => hasMilestonesIteration(code),
    'row-y-position': ({ code }) => hasRowYFromIndex(code),
    'run-preview': ({ doc }) => Boolean(doc && typeof doc.output === 'function'),
  },
  'text-wrap': {
    'long-summary': ({ code }) => hasProjectObject(code) && hasLongProjectSummary(code),
    'max-width': ({ code }) => /const\s+maxWidth\s*=/i.test(code),
    'split-text': ({ code }) => hasSplitTextToSizeCall(code),
    'wrapped-variable': ({ code }) =>
      /const\s+wrappedSummary\s*=\s*doc\.splitTextToSize\(/i.test(code),
    'text-wrapped-lines': ({ code }) => /doc\.text\(\s*wrappedSummary\s*,/i.test(code),
    'run-preview': ({ doc }) => Boolean(doc && typeof doc.output === 'function'),
  },
  'one-page-layout': {
    'page-margin': ({ code }) => /const\s+pageMargin\s*=/i.test(code),
    'content-width': ({ code }) => /const\s+contentWidth\s*=/i.test(code),
    'section-boxes': ({ code }) => countDocCalls(code, 'rect') >= 2,
    'divider-line': ({ code }) => hasDocCall(code, 'line'),
    'wrapped-summary': ({ code }) => hasProjectSummaryWrap(code),
    'project-data': ({ code }) => hasProjectObject(code) && countProjectPropertyUses(code) >= 3,
    footer: ({ code }) => hasFooterNearPageBottom(code),
    'run-preview': ({ doc }) => Boolean(doc && typeof doc.output === 'function'),
  },
  'checkpoint-project-summary': {
    'project-object': ({ code }) => hasProjectObject(code),
    'font-family': ({ code }) => hasDocCall(code, 'setFont'),
    'blueprint-header': ({ code }) => hasCheckpointHeaderBlueprint(code),
    'title-size': ({ code }) => hasSetFontSize(code, 22),
    'heading-size': ({ code }) => hasSetFontSize(code, 18),
    'body-size': ({ code }) => hasSetFontSize(code, 16),
    'contract-colors': ({ code }) => hasCheckpointContractColors(code),
    'section-cards': ({ code }) => hasCheckpointSectionStack(code),
    'divider-line': ({ code }) => hasDocCall(code, 'line'),
    'image-evidence': ({ code }) => hasCheckpointImageInBlueprintZone(code),
    'wrapped-summary': ({ code }) => hasProjectSummaryWrap(code),
    'project-fields': ({ code }) => usesRequiredProjectFields(code),
    footer: ({ code }) => hasFooterNearPageBottom(code),
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
