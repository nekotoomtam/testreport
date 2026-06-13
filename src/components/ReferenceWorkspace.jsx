import { useMemo, useState } from 'react';
import { jspdfCatalogSections } from '../reference/jspdfCatalog.js';

export function getReferenceItems() {
  return jspdfCatalogSections.flatMap((section) =>
    section.items.map((item) => ({
      ...item,
      sectionTitle: section.title,
    })),
  );
}

function OverviewVisual() {
  return (
    <div className="conceptOverviewBoard">
      <div className="conceptOverviewFlow" aria-hidden="true">
        <span className="conceptOverviewStep isCreate">new jsPDF()</span>
        <span className="conceptOverviewArrow" />
        <span className="conceptOverviewStep isState">set state</span>
        <span className="conceptOverviewArrow" />
        <span className="conceptOverviewStep isPlace">text / image / shape</span>
        <span className="conceptOverviewArrow" />
        <span className="conceptOverviewStep isExport">output / save</span>
      </div>
      <div className="conceptOverviewPaper">
        <span className="conceptOverviewTitle">PDF page</span>
        <span className="conceptOverviewTextLine isShort" />
        <span className="conceptOverviewTextLine" />
        <span className="conceptOverviewImage" />
        <span className="conceptOverviewShape" />
        <span className="conceptOverviewFooter">pageSize + measurements</span>
      </div>
    </div>
  );
}

function ConstructorVisual() {
  return (
    <div className="conceptPaperSet">
      <div className="conceptPaper isPortrait">
        <span>A4</span>
        <small>portrait</small>
      </div>
      <div className="conceptPaper isLandscape">
        <span>A3</span>
        <small>landscape</small>
      </div>
      <div className="conceptOptionStack">
        <span>unit: mm</span>
        <span>format: a4 / a3</span>
        <span>orientation</span>
      </div>
    </div>
  );
}

function PageSizeVisual() {
  return (
    <div className="conceptPaper conceptPaperGrid conceptPageSizePaper">
      <span className="conceptPageSizeChip">format + orientation</span>
      <span className="conceptPageSizeSheet" />
      <span className="conceptPageWidth">getWidth()</span>
      <span className="conceptPageHeight">getHeight()</span>
    </div>
  );
}

function AddPageVisual() {
  return (
    <div className="conceptPaper conceptAddPagePaper">
      <span className="conceptPageStack isFirst">page 1</span>
      <span className="conceptPageStack isSecond">page 2</span>
      <span className="conceptPageStack isThird">page 3</span>
      <span className="conceptAddPageChip">addPage()</span>
    </div>
  );
}

function TextVisual() {
  return (
    <div className="conceptPaper conceptPaperGrid">
      <span className="conceptAxis conceptAxisX">x</span>
      <span className="conceptAxis conceptAxisY">y</span>
      <span className="conceptOrigin">0,0</span>
      <span className="conceptMovingText">Hello</span>
      <span className="conceptTextX">x: left / right</span>
      <span className="conceptTextY">y: up / down</span>
    </div>
  );
}

function FontSizeVisual() {
  return (
    <div className="conceptPaper conceptFontPaper">
      <p className="conceptFontLine isSmall">setFontSize(10)</p>
      <p className="conceptFontLine isLatin">setFontSize(16)</p>
      <p className="conceptFontLine isLarge">setFontSize(24)</p>
      <p className="conceptFontMeta">state affects the next text()</p>
    </div>
  );
}

function TextColorVisual() {
  return (
    <div className="conceptPaper conceptFontPaper">
      <p className="conceptFontLine isBlue">setTextColor(36, 87, 214)</p>
      <p className="conceptFontLine isGreen">setTextColor(47, 125, 79)</p>
      <p className="conceptFontLine isOrange">setTextColor(180, 83, 9)</p>
      <p className="conceptFontMeta">color state flows into text()</p>
    </div>
  );
}

function TextWidthVisual() {
  return (
    <div className="conceptPaper conceptPaperGrid">
      <span className="conceptMeasuredText">Total Amount</span>
      <span className="conceptMeasureBracket" />
      <span className="conceptWidthReadout">getTextWidth(text)</span>
    </div>
  );
}

function LineVisual() {
  return (
    <div className="conceptPaper conceptPaperGrid">
      <span className="conceptLinePoint isStart">x1,y1</span>
      <span className="conceptLinePoint isEnd">x2,y2</span>
      <span className="conceptLine" />
    </div>
  );
}

function RectVisual({ rounded = false }) {
  return (
    <div className="conceptPaper conceptPaperGrid">
      <span className={`conceptRect ${rounded ? 'isRounded' : ''}`} />
      <span className="conceptRectStart" />
      <span className="conceptWidthLabel">width</span>
      <span className="conceptHeightLabel">height</span>
      {rounded ? <span className="conceptRadiusLabel">rx / ry</span> : null}
    </div>
  );
}

function CircleVisual() {
  return (
    <div className="conceptPaper conceptPaperGrid">
      <span className="conceptCircle" />
      <span className="conceptCircleCenter">x,y</span>
      <span className="conceptRadiusLine" />
      <span className="conceptRadiusText">r</span>
    </div>
  );
}

function ShapeStyleVisual() {
  return (
    <div className="conceptPaper conceptPaperGrid">
      <span className="conceptStyledRect" />
      <span className="conceptStyleChip isDraw">drawColor</span>
      <span className="conceptStyleChip isFill">fillColor</span>
      <span className="conceptStyleChip isLine">lineWidth</span>
    </div>
  );
}

function ImageVisual() {
  return (
    <div className="conceptPaper conceptPaperGrid">
      <div className="conceptImageFrame">
        <img src="/images/lesson-image-sample.svg" alt="" />
      </div>
      <span className="conceptRectStart" />
      <span className="conceptWidthLabel">width</span>
      <span className="conceptHeightLabel">height</span>
      <span className="conceptCoordinateLabel">x, y</span>
    </div>
  );
}

function FontRegistryVisual() {
  return (
    <div className="conceptPaper conceptFontPaper">
      <span className="conceptFontFile">TTF data</span>
      <span className="conceptFontArrow" />
      <p className="conceptFontLine isLatin">addFont family</p>
      <p className="conceptFontLine isThai">รายงานโครงการ</p>
      <p className="conceptFontMeta">setFont(family, style)</p>
    </div>
  );
}

function WrapVisual() {
  return (
    <div className="conceptPaper conceptWrapPaper">
      <span className="conceptMaxWidth">maxWidth</span>
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

function OutputVisual({ isSave = false }) {
  return (
    <div className="conceptPaper conceptSavePaper">
      <span className="conceptDownloadSheet" />
      <span className="conceptDownloadButton">
        {isSave ? 'file-name.pdf' : "output('blob')"}
      </span>
    </div>
  );
}

export function ConceptVisual({ item }) {
  switch (item.visualKind) {
    case 'overview':
      return <OverviewVisual />;
    case 'constructor':
      return <ConstructorVisual />;
    case 'page-size':
      return <PageSizeVisual />;
    case 'add-page':
      return <AddPageVisual />;
    case 'text-position':
      return <TextVisual />;
    case 'font-size':
      return <FontSizeVisual />;
    case 'text-color':
      return <TextColorVisual />;
    case 'text-width':
      return <TextWidthVisual />;
    case 'line':
      return <LineVisual />;
    case 'rect':
      return <RectVisual />;
    case 'rounded-rect':
      return <RectVisual rounded />;
    case 'circle':
      return <CircleVisual />;
    case 'shape-style':
      return <ShapeStyleVisual />;
    case 'image':
      return <ImageVisual />;
    case 'font-registry':
      return <FontRegistryVisual />;
    case 'wrap':
      return <WrapVisual />;
    case 'output':
      return <OutputVisual />;
    case 'save':
      return <OutputVisual isSave />;
    default:
      return <ConstructorVisual />;
  }
}

export function ReferenceTeachingPanel({ item }) {
  return (
    <>
      <div className="conceptSurface">
        <ConceptVisual item={item} />
      </div>

      <div className="conceptDetailPanel">
        <code>{item.signature}</code>
        <p>{item.mentalModel}</p>
        <dl>
          {item.parameters.map((parameter) => (
            <div key={parameter.name}>
              <dt>{parameter.name}</dt>
              <dd>{parameter.detail}</dd>
            </div>
          ))}
        </dl>
        <pre>
          <code>{item.example}</code>
        </pre>
      </div>
    </>
  );
}

function ReferenceWorkspace() {
  const referenceItems = useMemo(() => getReferenceItems(), []);
  const [selectedReferenceId, setSelectedReferenceId] = useState(referenceItems[0]?.id);
  const selectedReference =
    referenceItems.find((item) => item.id === selectedReferenceId) ?? referenceItems[0];

  return (
    <>
      <section className="lessonPane referencePane" aria-labelledby="reference-title">
        <div className="lessonHeader">
          <p className="eyebrow">Reference / Mental Model</p>
          <h2 id="reference-title">สารบัญ jsPDF</h2>
          <p>
            เริ่มจากภาพรวม แล้วเลือก API node เพื่อดูภาพจำลองของ parameter และ state
            ก่อนลงมือทำจริงในบทเรียน
          </p>
        </div>

        <div className="referenceTopicGroups">
          {jspdfCatalogSections.map((section) => (
            <section key={section.id} className="referenceTopicGroup">
              <div className="referenceTopicGroupHeader">
                <h3>{section.title}</h3>
                <p>{section.summary}</p>
              </div>
              <div className="referenceTopicList">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`referenceTopicCard ${
                      selectedReference.id === item.id ? 'isSelected' : ''
                    }`}
                    onClick={() => setSelectedReferenceId(item.id)}
                  >
                    <span>{item.name}</span>
                    <code>{item.signature}</code>
                    <small>{item.apiType}</small>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="previewPane conceptPane" aria-labelledby="concept-title">
        <div className="previewHeader">
          <p className="eyebrow">{selectedReference.sectionTitle} / {selectedReference.apiType}</p>
          <h2 id="concept-title">{selectedReference.name}</h2>
        </div>

        <ReferenceTeachingPanel item={selectedReference} />
      </section>
    </>
  );
}

export default ReferenceWorkspace;
