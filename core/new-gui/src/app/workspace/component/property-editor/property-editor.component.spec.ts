import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { MaterialDesignFrameworkModule } from 'angular6-json-schema-form';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { PropertyEditorComponent } from './property-editor.component';

import { WorkflowActionService } from './../../service/workflow-graph/model/workflow-action.service';
import { UndoRedoService } from './../../service/undo-redo/undo-redo.service';
import { OperatorMetadataService } from './../../service/operator-metadata/operator-metadata.service';
import { StubOperatorMetadataService } from './../../service/operator-metadata/stub-operator-metadata.service';
import { JointUIService } from './../../service/joint-ui/joint-ui.service';

import { mockScanSourceSchema, mockViewResultsSchema } from './../../service/operator-metadata/mock-operator-metadata.data';

import { configure } from 'rxjs-marbles';
const { marbles } = configure({ run: false });

import { mockResultPredicate, mockScanPredicate, mockPoint } from '../../service/workflow-graph/model/mock-workflow-data';
import { CustomNgMaterialModule } from '../../../common/custom-ng-material.module';
import { DynamicSchemaService } from '../../service/dynamic-schema/dynamic-schema.service';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormlyModule } from '@ngx-formly/core';
import { TEXERA_FORMLY_CONFIG } from 'src/app/common/formly/formly-config';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* tslint:disable:no-non-null-assertion */

describe('PropertyEditorComponent', () => {
  let component: PropertyEditorComponent;
  let fixture: ComponentFixture<PropertyEditorComponent>;
  let workflowActionService: WorkflowActionService;
  let dynamicSchemaService: DynamicSchemaService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PropertyEditorComponent],
      providers: [
        JointUIService,
        WorkflowActionService,
        UndoRedoService,
        { provide: OperatorMetadataService, useClass: StubOperatorMetadataService },
        DynamicSchemaService,
        FormlyJsonschema
      ],
      imports: [
        CustomNgMaterialModule,
        BrowserAnimationsModule,
        MaterialDesignFrameworkModule,
        NgbModule,
        FormlyModule.forRoot(TEXERA_FORMLY_CONFIG),
        FormlyMaterialModule,
        FormsModule,
        ReactiveFormsModule,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyEditorComponent);
    component = fixture.componentInstance;
    workflowActionService = TestBed.get(WorkflowActionService);
    dynamicSchemaService = TestBed.get(DynamicSchemaService);

    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * test if the property editor correctly receives the operator highlight stream,
   *  get the operator data (id, property, and metadata), and then display the form.
   */
  it('should change the content of property editor from an empty panel correctly', () => {
    const jointGraphWrapper = workflowActionService.getJointGraphWrapper();

    // check if the changePropertyEditor called after the operator
    //  is highlighted has correctly updated the variables
    const predicate = mockScanPredicate;

    // add and highlight an operator
    workflowActionService.addOperator(predicate, mockPoint);
    jointGraphWrapper.highlightOperator(predicate.operatorID);

    fixture.detectChanges();

    // check variables are set correctly
    expect(component.currentOperatorID).toEqual(predicate.operatorID);
    expect(component.currentOperatorSchema).toEqual(mockScanSourceSchema);
    expect(component.formData).toEqual(predicate.operatorProperties);
    expect(component.displayForm).toBeTruthy();

    // check HTML form are displayed
    const formTitleElement = fixture.debugElement.query(By.css('.texera-workspace-property-editor-title'));
    const jsonSchemaFormElement = fixture.debugElement.query(By.css('.texera-workspace-property-editor-form'));

    // check the panel title
    expect((formTitleElement.nativeElement as HTMLElement).innerText).toEqual(
      mockScanSourceSchema.additionalMetadata.userFriendlyName);

    expect(jsonSchemaFormElement).toBeTruthy();

  });


  it('should switch the content of property editor to another operator from the former operator correctly', fakeAsync(() => {
    const jointGraphWrapper = workflowActionService.getJointGraphWrapper();

    // add two operators
    workflowActionService.addOperator(mockScanPredicate, mockPoint);
    workflowActionService.addOperator(mockResultPredicate, mockPoint);

    // highlight the first operator
    jointGraphWrapper.highlightOperator(mockScanPredicate.operatorID);
    fixture.detectChanges();

    // check the variables
    expect(component.currentOperatorID).toEqual(mockScanPredicate.operatorID);
    expect(component.currentOperatorSchema).toEqual(mockScanSourceSchema);
    expect(component.formData).toEqual(mockScanPredicate.operatorProperties);
    expect(component.displayForm).toBeTruthy();

    // highlight the second operator
    jointGraphWrapper.highlightOperator(mockResultPredicate.operatorID);
    fixture.detectChanges();
    tick(PropertyEditorComponent.formInputDebounceTime + 10);

    expect(component.currentOperatorID).toEqual(mockResultPredicate.operatorID);
    expect(component.currentOperatorSchema).toEqual(mockViewResultsSchema);
    // special case: the mock result predicate has an default value, which causes the form data to be changed
    expect(component.formData).toEqual(
      workflowActionService.getTexeraGraph().getOperator(mockResultPredicate.operatorID).operatorProperties);
    expect(component.displayForm).toBeTruthy();

    // check HTML form are displayed
    const formTitleElementAfterChange = fixture.debugElement.query(By.css('.texera-workspace-property-editor-title'));
    const jsonSchemaFormElementAfterChange = fixture.debugElement.query(By.css('.texera-workspace-property-editor-form'));

    // check the panel title
    expect((formTitleElementAfterChange.nativeElement as HTMLElement).innerText).toEqual(
      mockViewResultsSchema.additionalMetadata.userFriendlyName);
    expect(jsonSchemaFormElementAfterChange).toBeTruthy();

  }));

  /**
   * test if the property editor correctly receives the operator unhighlight stream
   *  and displays the operator's data when it's the only highlighted operator.
   */
  it('should switch the content of property editor to the highlighted operator correctly when only one operator is highlighted',
  () => {
    const jointGraphWrapper = workflowActionService.getJointGraphWrapper();

    // add and highlight two operators, then unhighlight one of them
    workflowActionService.addOperatorsAndLinks([{ op: mockScanPredicate, pos: mockPoint },
    { op: mockResultPredicate, pos: mockPoint }], []);
    jointGraphWrapper.highlightOperators([mockScanPredicate.operatorID, mockResultPredicate.operatorID]);
    jointGraphWrapper.unhighlightOperator(mockResultPredicate.operatorID);

    // assert that only one operator is highlighted on the graph
    const predicate = mockScanPredicate;
    expect(jointGraphWrapper.getCurrentHighlightedOperatorIDs()).toEqual([predicate.operatorID]);

    fixture.detectChanges();

    // check if the changePropertyEditor called after the operator
    //  is unhighlighted has correctly updated the variables

    // check variables are set correctly
    expect(component.currentOperatorID).toEqual(predicate.operatorID);
    expect(component.currentOperatorSchema).toEqual(mockScanSourceSchema);
    expect(component.formData).toEqual(predicate.operatorProperties);
    expect(component.displayForm).toBeTruthy();

    // check HTML form are displayed
    const formTitleElement = fixture.debugElement.query(By.css('.texera-workspace-property-editor-title'));
    const jsonSchemaFormElement = fixture.debugElement.query(By.css('.texera-workspace-property-editor-form'));

    // check the panel title
    expect((formTitleElement.nativeElement as HTMLElement).innerText).toEqual(
      mockScanSourceSchema.additionalMetadata.userFriendlyName);
    expect(jsonSchemaFormElement).toBeTruthy();

  });

  /**
   * test if the property editor correctly receives the operator unhighlight stream
   *  and clears all the operator data, and hide the form.
   */
  it('should clear and hide the property editor panel correctly when no operator is highlighted', () => {
    const jointGraphWrapper = workflowActionService.getJointGraphWrapper();

    // add and highlight an operator
    workflowActionService.addOperator(mockScanPredicate, mockPoint);
    jointGraphWrapper.highlightOperator(mockScanPredicate.operatorID);

    // unhighlight the operator
    jointGraphWrapper.unhighlightOperator(mockScanPredicate.operatorID);
    expect(jointGraphWrapper.getCurrentHighlightedOperatorIDs()).toEqual([]);

    fixture.detectChanges();

    // check if the clearPropertyEditor called after the operator
    //  is unhighlighted has correctly updated the variables
    expect(component.currentOperatorID).toBeFalsy();
    expect(component.currentOperatorSchema).toBeFalsy();
    expect(component.formData).toBeFalsy();
    expect(component.displayForm).toBeFalsy();

    // check HTML form are not displayed
    const formTitleElement = fixture.debugElement.query(By.css('.texera-workspace-property-editor-title'));
    const jsonSchemaFormElement = fixture.debugElement.query(By.css('.texera-workspace-property-editor-form'));

    expect(formTitleElement).toBeFalsy();
    expect(jsonSchemaFormElement).toBeFalsy();
  });

  it('should clear and hide the property editor panel correctly when multiple operators are highlighted', () => {
    const jointGraphWrapper = workflowActionService.getJointGraphWrapper();

    // add and highlight two operators
    workflowActionService.addOperatorsAndLinks([{ op: mockScanPredicate, pos: mockPoint },
    { op: mockResultPredicate, pos: mockPoint }], []);
    jointGraphWrapper.highlightOperators([mockScanPredicate.operatorID, mockResultPredicate.operatorID]);

    // assert that multiple operators are highlighted
    expect(jointGraphWrapper.getCurrentHighlightedOperatorIDs()).toContain(mockResultPredicate.operatorID);
    expect(jointGraphWrapper.getCurrentHighlightedOperatorIDs()).toContain(mockScanPredicate.operatorID);

    fixture.detectChanges();

    // expect that the property editor is cleared
    expect(component.currentOperatorID).toBeFalsy();
    expect(component.currentOperatorSchema).toBeFalsy();
    expect(component.formData).toBeFalsy();
    expect(component.displayForm).toBeFalsy();

    // check HTML form are not displayed
    const formTitleElement = fixture.debugElement.query(By.css('.texera-workspace-property-editor-title'));
    const jsonSchemaFormElement = fixture.debugElement.query(By.css('.texera-workspace-property-editor-form'));

    expect(formTitleElement).toBeFalsy();
    expect(jsonSchemaFormElement).toBeFalsy();
  });

  it('should change Texera graph property when the form is edited by the user', fakeAsync(() => {
    const jointGraphWrapper = workflowActionService.getJointGraphWrapper();

    // add an operator and highlight the operator so that the
    //  variables in property editor component is set correctly
    workflowActionService.addOperator(mockScanPredicate, mockPoint);
    jointGraphWrapper.highlightOperator(mockScanPredicate.operatorID);

    // stimulate a form change by the user
    const formChangeValue = { tableName: 'twitter_sample' };
    component.onFormChanges(formChangeValue);

    // maintain a counter of how many times the event is emitted
    let emitEventCounter = 0;
    component.outputFormChangeEventStream.subscribe(() => emitEventCounter++);

    // fakeAsync enables tick, which waits for the set property debounce time to finish
    tick(PropertyEditorComponent.formInputDebounceTime + 10);

    // then get the opeator, because operator is immutable, the operator before the tick
    //   is a different object reference from the operator after the tick
    const operator = workflowActionService.getTexeraGraph().getOperator(mockScanPredicate.operatorID);
    if (!operator) {
      throw new Error(`operator ${mockScanPredicate.operatorID} is undefined`);
    }
    expect(operator.operatorProperties).toEqual(formChangeValue);
    expect(emitEventCounter).toEqual(1);
  }));

  it('should debounce the user form input to avoid emitting event too frequently', marbles(m => {
    const jointGraphWrapper = workflowActionService.getJointGraphWrapper();

    // add an operator and highlight the operator so that the
    //  variables in property editor component is set correctly
    workflowActionService.addOperator(mockScanPredicate, mockPoint);
    jointGraphWrapper.highlightOperator(mockScanPredicate.operatorID);

    // prepare the form user input event stream
    // simulate user types in `table` character by character
    const formUserInputMarbleString = '-a-b-c-d-e';
    const formUserInputMarbleValue = {
      a: { tableName: 't' },
      b: { tableName: 'ta' },
      c: { tableName: 'tab' },
      d: { tableName: 'tabl' },
      e: { tableName: 'table' },
    };
    const formUserInputEventStream = m.hot(formUserInputMarbleString, formUserInputMarbleValue);

    // prepare the expected output stream after debounce time
    const formChangeEventMarbleStrig =
      // wait for the time of last marble string starting to emit
      '-'.repeat(formUserInputMarbleString.length - 1) +
      // then wait for debounce time (each tick represents 10 ms)
      '-'.repeat(PropertyEditorComponent.formInputDebounceTime / 10) +
      'e-';
    const formChangeEventMarbleValue = {
      e: { tableName: 'table' } as object
    };
    const expectedFormChangeEventStream = m.hot(formChangeEventMarbleStrig, formChangeEventMarbleValue);


    m.bind();

    const actualFormChangeEventStream = component.createOutputFormChangeEventStream(formUserInputEventStream);
    formUserInputEventStream.subscribe();

    m.expect(actualFormChangeEventStream).toBeObservable(expectedFormChangeEventStream);

  }));

  it('should not emit operator property change event if the new property is the same as the old property', fakeAsync(() => {
    const jointGraphWrapper = workflowActionService.getJointGraphWrapper();

    // add an operator and highlight the operator so that the
    //  variables in property editor component is set correctly
    workflowActionService.addOperator(mockScanPredicate, mockPoint);
    const mockOperatorProperty = { tableName: 'table' };
    // set operator property first before displaying the operator property in property panel
    workflowActionService.setOperatorProperty(mockScanPredicate.operatorID, mockOperatorProperty);
    jointGraphWrapper.highlightOperator(mockScanPredicate.operatorID);


    // stimulate a form change with the same property
    component.onFormChanges(mockOperatorProperty);

    // maintain a counter of how many times the event is emitted
    let emitEventCounter = 0;
    component.outputFormChangeEventStream.subscribe(() => emitEventCounter++);

    // fakeAsync enables tick, which waits for the set property debounce time to finish
    tick(PropertyEditorComponent.formInputDebounceTime + 10);

    // assert that the form change event doesn't emit any time
    // because the form change value is the same
    expect(emitEventCounter).toEqual(0);


  }));

});
