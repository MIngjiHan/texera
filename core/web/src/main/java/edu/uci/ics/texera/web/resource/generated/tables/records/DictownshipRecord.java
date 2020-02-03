/*
 * This file is generated by jOOQ.
 */
package edu.uci.ics.texera.web.resource.generated.tables.records;


import edu.uci.ics.texera.web.resource.generated.tables.Dictownship;

import javax.annotation.processing.Generated;

import org.jooq.Field;
import org.jooq.Record2;
import org.jooq.Row2;
import org.jooq.impl.UpdatableRecordImpl;


/**
 * This class is generated by jOOQ.
 */
@Generated(
    value = {
        "http://www.jooq.org",
        "jOOQ version:3.12.4"
    },
    comments = "This class is generated by jOOQ"
)
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class DictownshipRecord extends UpdatableRecordImpl<DictownshipRecord> implements Record2<Integer, Integer> {

    private static final long serialVersionUID = 956519069;

    /**
     * Setter for <code>texera.dictownship.userID</code>.
     */
    public void setUserid(Integer value) {
        set(0, value);
    }

    /**
     * Getter for <code>texera.dictownship.userID</code>.
     */
    public Integer getUserid() {
        return (Integer) get(0);
    }

    /**
     * Setter for <code>texera.dictownship.dictID</code>.
     */
    public void setDictid(Integer value) {
        set(1, value);
    }

    /**
     * Getter for <code>texera.dictownship.dictID</code>.
     */
    public Integer getDictid() {
        return (Integer) get(1);
    }

    // -------------------------------------------------------------------------
    // Primary key information
    // -------------------------------------------------------------------------

    @Override
    public Record2<Integer, Integer> key() {
        return (Record2) super.key();
    }

    // -------------------------------------------------------------------------
    // Record2 type implementation
    // -------------------------------------------------------------------------

    @Override
    public Row2<Integer, Integer> fieldsRow() {
        return (Row2) super.fieldsRow();
    }

    @Override
    public Row2<Integer, Integer> valuesRow() {
        return (Row2) super.valuesRow();
    }

    @Override
    public Field<Integer> field1() {
        return Dictownship.DICTOWNSHIP.USERID;
    }

    @Override
    public Field<Integer> field2() {
        return Dictownship.DICTOWNSHIP.DICTID;
    }

    @Override
    public Integer component1() {
        return getUserid();
    }

    @Override
    public Integer component2() {
        return getDictid();
    }

    @Override
    public Integer value1() {
        return getUserid();
    }

    @Override
    public Integer value2() {
        return getDictid();
    }

    @Override
    public DictownshipRecord value1(Integer value) {
        setUserid(value);
        return this;
    }

    @Override
    public DictownshipRecord value2(Integer value) {
        setDictid(value);
        return this;
    }

    @Override
    public DictownshipRecord values(Integer value1, Integer value2) {
        value1(value1);
        value2(value2);
        return this;
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    /**
     * Create a detached DictownshipRecord
     */
    public DictownshipRecord() {
        super(Dictownship.DICTOWNSHIP);
    }

    /**
     * Create a detached, initialised DictownshipRecord
     */
    public DictownshipRecord(Integer userid, Integer dictid) {
        super(Dictownship.DICTOWNSHIP);

        set(0, userid);
        set(1, dictid);
    }
}